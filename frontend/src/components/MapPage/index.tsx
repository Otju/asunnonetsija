import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/dist/styles.min.css'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from '../../assets/houseLocation.svg'
import { District } from './../../sharedTypes/types'
import { Coordinates } from './../../sharedTypes/typesFromRuntypes'
import { useState } from 'react'
import { DistrictPolygons, Detector } from './components'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import schoolDistricts from '../../assets/schoolDistricts.json'
import { DistrictType } from './../../sharedTypes/types'

interface BoundsCoordinates {
  lat: number
  lng: number
}
interface Bounds {
  _northEast: BoundsCoordinates
  _southWest: BoundsCoordinates
}

export interface Points {
  coordinates: LatLng
  id: number
}

const MapPage: React.FC<{
  houseCoordinates: Coordinates[]
  districts: District[]
}> = ({ houseCoordinates, districts }) => {
  const districtTypes: DistrictType[] = ['ruotsiAla', 'ruotsiYla', 'suomiAla', 'suomiYla']
  const defaultZoom = 10
  const [bounds, setBounds] = useState<Bounds>()
  const [zoom, setZoom] = useState(defaultZoom)
  const [districtTypeIndex, setDistrictTypeIndex] = useState<number>(0)
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])

  const handleDistrictSelect = (name: string, selected: boolean) => {
    const newDistricts = selected
      ? selectedDistricts.filter((itemName) => itemName !== name)
      : [...selectedDistricts, name]
    setSelectedDistricts(newDistricts)
  }

  const handeDistrictTypeChange = () => {
    if (districtTypeIndex === 3) {
      setDistrictTypeIndex(0)
    } else {
      setDistrictTypeIndex(districtTypeIndex + 1)
    }
  }

  const currentDistrictType = districtTypes[districtTypeIndex]

  houseCoordinates = houseCoordinates.sort()

  let markerCoordinates: Coordinates[] = []

  houseCoordinates.forEach(({ lat, lon }) => {
    if (!markerCoordinates.find((item) => item.lat === lat && item.lon === lon)) {
      markerCoordinates.push({ lat, lon })
    }
  })

  markerCoordinates = markerCoordinates.filter(({ lat, lon }) => {
    if (!bounds) {
      return false
    }
    return (
      lat < bounds._northEast.lat &&
      lat > bounds._southWest.lat &&
      lon < bounds._northEast.lng &&
      lon > bounds._southWest.lng
    )
  })

  const iconAsHTML = ReactDOMServer.renderToString(<Icon width={50} height={60} />)
  const iconHouse = new L.DivIcon({
    html: iconAsHTML,
    iconAnchor: [25, 60],
    className: 'dummy',
  })

  const markers = markerCoordinates.map(({ lat, lon }, i) => (
    <Marker position={[lat, lon]} icon={iconHouse} key={i} />
  ))
  console.log(zoom)
  console.log(districts)

  console.log(<MarkerClusterGroup>{markers}</MarkerClusterGroup>)

  return (
    <>
      <button onClick={handeDistrictTypeChange}>{currentDistrictType}</button>
      <MapContainer center={[60.232, 24.91]} zoom={defaultZoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DistrictPolygons
          districts={schoolDistricts[currentDistrictType]}
          handleDistrictSelect={handleDistrictSelect}
          selectedDistricts={selectedDistricts}
        />
        <Detector setBounds={setBounds} setZoom={setZoom} handleClick={() => {}} />
      </MapContainer>
    </>
  )
}

export default MapPage
