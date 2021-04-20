import fetch from 'node-fetch'
import { isInBoundaries } from './getBoundaries'
import proj4 from 'proj4'
const parseString = require('xml2js').parseString
const parseKML = require('parse-kml')
import { readFromFile, writeToFile } from './fileEditor'
import {
  isInPolygon,
  latLonArrayToNumberArrayArray,
  NumberArrayArrayToCoordinates,
} from './coordinateCalc'
import extraDistricts from './data/extraDistricts.json'
import {
  Coordinates,
  SchoolDistrict,
  SchoolDistrictType,
  School,
} from './sharedTypes/typesFromRuntypes'
import schoolsWithTypes from './data/schoolsWithTypes.json'
const hull = require('hull.js')

proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
proj4.defs(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
)

const formatCoordinates = (coordinates: number[], toFormat: 3067 | 3879) => {
  const outputCoordinates = proj4(`EPSG:${toFormat}`, 'EPSG:4326').forward(coordinates)
  return { lon: outputCoordinates[0], lat: outputCoordinates[1] }
}

const types: SchoolDistrictType[] = ['ruotsiAla', 'ruotsiYla', 'suomiAla', 'suomiYla']

const getHelsinkiSchoolDistricts = async () => {
  const allSchools = []
  const helTypes = [
    {
      type: 'ruotsiAla',
      searchType: 'Opev_ooa_alaaste_ruotsi',
    },
    {
      type: 'ruotsiYla',
      searchType: 'Opev_ooa_ylaaste_ruotsi',
    },
    {
      type: 'suomiAla',
      searchType: 'Opev_ooa_alaaste_suomi',
    },
    {
      type: 'suomiYla',
      searchType: 'Opev_ooa_ylaaste_suomi',
    },
  ]
  for (const { type, searchType } of helTypes) {
    /*
    const res = await fetch(
      `https://kartta.hel.fi/ws/geoserver/avoindata/wfs?version=1.1.0&request=GetFeature&typeName=${searchType}&outputformat=json`
    )
    const data = await res.json()
        */
    const data = readFromFile(`/helSchools/${searchType}.json`, 'JSON')
    const schools = data.features
    //@ts-ignore
    const parsed = schools.map((school) => {
      const rawCoordinates = school.geometry.coordinates
      const nameFi = school.properties.nimi_fi
      const nameSv = school.properties.nimi_se
      const name = nameFi || nameSv
      const coordinates = rawCoordinates[0].map((cor: number[]) => formatCoordinates(cor, 3879))
      return { coordinates, type, name, city: 'Helsinki' }
    })
    allSchools.push(...parsed)
  }
  return allSchools
}

const getEspooSchoolDistrictsForType = async (type: string) => {
  const res = await fetch(
    `https://kartat.espoo.fi/teklaogcweb/wfs.ashx?request=GetFeature&typeName=${type}`
  )
  const raw = await res.text()
  let result
  parseString(raw, function (_err: any, res: any) {
    result = res
  })
  //@ts-ignore
  const schools = result['wfs:FeatureCollection']['gml:featureMember'].map((item) => {
    const fields = item[type][0]
    const name = fields['GIS:Nimi']
    const rawCoordinates =
      fields['GIS:Geometry'][0]['gml:Polygon'][0]['gml:outerBoundaryIs'][0]['gml:LinearRing'][0][
        'gml:coordinates'
      ][0]
    const coordinates = rawCoordinates.split(' ').map((item: string) => {
      const coordinates = item.split(',').map((cor) => parseFloat(cor))
      return formatCoordinates(coordinates, 3879)
    })
    return { name, coordinates, city: 'Espoo' }
  })
  return schools
}

const getEspooSchoolDistricts = async () => {
  const allSchools: SchoolDistrict[] = []
  const swe = await getEspooSchoolDistrictsForType('GIS:Oppilaaksiottoalueet_ruotsinkielinen')
  const fin = await getEspooSchoolDistrictsForType('GIS:Oppilaaksiottoalueet_suomenkielinen')
  swe.forEach((item: any) => {
    allSchools.push({ ...item, type: 'ruotsiAla' })
    allSchools.push({ ...item, type: 'ruotsiYla' })
  })
  fin.forEach((item: any) => {
    allSchools.push({ ...item, type: 'suomiAla' })
    allSchools.push({ ...item, type: 'suomiYla' })
  })
  return allSchools
}

const getVantaaSchoolDistricts = async () => {
  const data = await parseKML.toJson(
    `https://datastore.hri.fi/Vantaa/opetusjakoulutus/oppilaaksiotto/Oppilaaksiottoalueet_Vantaa.kml`
  )
  const schools = data.features

  const parsed: SchoolDistrict[] = []
  //Vantaa nimetyt ruotsi ala, ruotsi ylä on koko vantaa, muut ovat suomen peruskoulu
  //@ts-ignore
  schools.map((school) => {
    const rawCoordinates = school.geometry.coordinates
    const name = school.properties.koulu || school.properties.Oppilaaksiottoalue
    const coordinates = rawCoordinates[0].map(([lon, lat]: number[]) => ({ lat, lon }))
    if (name.includes('oppilaaksiotto')) {
      parsed.push({ coordinates, name, type: 'suomiAla', city: 'Vantaa' })
      parsed.push({ coordinates, name, type: 'suomiYla', city: 'Vantaa' })
    } else {
      parsed.push({ coordinates, name, type: 'ruotsiAla', city: 'Vantaa' })
    }
  })
  const vantaaBorders: Coordinates[] = []
  parsed
    .filter(({ type }) => type === 'ruotsiAla')
    .forEach(({ coordinates }) => {
      coordinates.forEach((coordinate) => {
        if (!vantaaBorders.includes(coordinate)) {
          vantaaBorders.push(coordinate)
        }
      })
    })
  parsed.push({
    coordinates: NumberArrayArrayToCoordinates(
      hull(latLonArrayToNumberArrayArray(vantaaBorders), 0.05)
    ),
    name: 'Koko Vantaa',
    type: 'ruotsiYla',
    city: 'Vantaa',
  })
  return parsed
}

const getAllSchoolDistricts = async () => {
  const vantaa = await getVantaaSchoolDistricts()
  const espoo = await getEspooSchoolDistricts()
  const helsinki = await getHelsinkiSchoolDistricts()
  const kauniainen = types.map((type) => ({ ...extraDistricts.kauniainen, type }))
  const schoolDistricts: SchoolDistrict[] = [...espoo, ...helsinki, ...kauniainen, ...vantaa]
  return schoolDistricts
}

interface inputThing {
  coordinates: Coordinates
  name: string
}

const addToRightSchoolType = (
  parsed: School[],
  { coordinates, name }: inputThing,
  lang: 'suomi' | 'ruotsi'
) => {
  if (name.includes('ala-')) {
    //@ts-ignore
    parsed.push({ coordinates, name, type: `${lang}Ala` })
  } else if (name.includes('yläast')) {
    //@ts-ignore
    parsed.push({ coordinates, name, type: `${lang}Yla` })
  } else {
    //@ts-ignore
    parsed.push({ coordinates, name, type: `${lang}Ala` })
    //@ts-ignore
    parsed.push({ coordinates, name, type: `${lang}Yla` })
  }
}

const getAllSchools = async () => {
  const res = await fetch(
    `https://geo.stat.fi/geoserver/oppilaitokset/wfs?service=WFS&request=GetFeature&version=2.0.0&outputformat=json&typeName=oppilaitokset`
  )
  const data = await res.json()
  const schools = data.features
  const parsed: School[] = []
  //@ts-ignore
  schools.forEach((school) => {
    const rawCoordinates = school.geometry.coordinates
    const coordinates = formatCoordinates(rawCoordinates, 3067)
    if (isInBoundaries(coordinates)) {
      const typeNumber = Number(school.properties.oltyp)
      const id = school.properties.tunn
      const languageNumber = Number(schoolsWithTypes.find((item) => item.Tunnus === id)?.Kieli) || 1
      const name = school.properties.onimi
      if (typeNumber === 12) {
        return
      } else if (typeNumber === 15) {
        parsed.push({ coordinates, name, type: 'lukio' })
      } else if (languageNumber === 1) {
        addToRightSchoolType(parsed, { coordinates, name }, 'suomi')
      } else if (languageNumber === 2) {
        addToRightSchoolType(parsed, { coordinates, name }, 'ruotsi')
      } else if (languageNumber === 3) {
        addToRightSchoolType(parsed, { coordinates, name }, 'suomi')
        addToRightSchoolType(parsed, { coordinates, name }, 'ruotsi')
      }
    }
  })
  return parsed
}

const getDistrictsOfType = (schoolDistricts: SchoolDistrict[], filterType: SchoolDistrictType) => {
  return schoolDistricts
    .filter(({ type }) => type === filterType)
    .map(({ coordinates, name, city }) => ({
      coordinates,
      name: typeof name === 'string' ? name : name[0],
      city,
    }))
}

const getSchoolsAndDistricts = async () => {
  let schools = await getAllSchools()
  const schoolDistricts = await getAllSchoolDistricts()
  const groupedSchoolDistricts = Object.fromEntries(
    types.map((type) => [type, getDistrictsOfType(schoolDistricts, type)])
  )
  schools = schools.map((item) => ({
    ...item,
    districts: Object.fromEntries(
      types.map((type) => [
        type,
        groupedSchoolDistricts[type].find(({ coordinates }) =>
          isInPolygon(item.coordinates, coordinates)
        )?.name,
      ])
    ),
  }))
  writeToFile('schools.json', schools, 'JSON')
  writeToFile('schoolDistricts.json', groupedSchoolDistricts, 'JSON', true)
}

export default getSchoolsAndDistricts
