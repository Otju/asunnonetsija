import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from '../../assets/houseLocation.svg'
import { Coordinates, District } from '../../../../types'
import { useState } from 'react'
import { DistrictPolygons, Detector } from './components'
import calculateDistance from 'haversine-distance'

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
  points: Points[]
}> = ({ houseCoordinates, districts, points }) => {
  const defaultZoom = 10
  const [bounds, setBounds] = useState<Bounds>()
  const [zoom, setZoom] = useState(defaultZoom)
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])

  const handleDistrictSelect = (name: string, selected: boolean) => {
    const newDistricts = selected
      ? selectedDistricts.filter((itemName) => itemName !== name)
      : [...selectedDistricts, name]
    setSelectedDistricts(newDistricts)
  }

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

  const metersPerPx = (156543.03392 * Math.cos((60.1733244 * Math.PI) / 180)) / Math.pow(2, zoom)
  interface groupedMarker {
    lat: number
    lon: number
    count: number
  }

  const groupedMarkers: groupedMarker[] = []
  let remainingMarkers = markerCoordinates

  const sameCoordinates = (cor1: Coordinates, cor2: Coordinates) =>
    cor1.lat === cor2.lat && cor1.lon === cor2.lon

  markerCoordinates.forEach((coordinates1) => {
    if (remainingMarkers.find((coordinates) => sameCoordinates(coordinates1, coordinates))) {
      const closeByMarkers = remainingMarkers.filter((coordinates2) => {
        const distance = calculateDistance(coordinates1, coordinates2)
        const disanceInPx = distance / metersPerPx
        return disanceInPx <= 60
      })
      groupedMarkers.push({ ...coordinates1, count: closeByMarkers.length })
      remainingMarkers = remainingMarkers.filter(
        (remainingCoordinates) =>
          !closeByMarkers.find((closeByCoordinates) =>
            sameCoordinates(remainingCoordinates, closeByCoordinates)
          )
      )
    }
  })

  const iconAsHTML = ReactDOMServer.renderToString(<Icon width={50} height={60} />)
  const iconHouse = new L.DivIcon({
    html: iconAsHTML,
    iconAnchor: [25, 60],
    className: 'dummy',
  })

  const markers = groupedMarkers.map(({ lat, lon, count }, i) => {
    const size = 40 + count * 0.1
    const icon =
      count === 1
        ? iconHouse
        : new L.DivIcon({
            html: `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${
              size / 2
            }" r="${size * 0.4}" fill="#black" fill-opacity="0.7"/>
                      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="${
                        size * 0.4
                      }px" font-family="Arial" dy=".3em">${count}</text>
                   </svg>`,
            iconAnchor: [size / 2, size / 2],
            className: 'dummy',
          })
    return <Marker position={[lat, lon]} icon={icon} key={i} />
  })

  return (
    <MapContainer center={[60.232, 24.91]} zoom={defaultZoom}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
      <DistrictPolygons
        districts={districts}
        handleDistrictSelect={handleDistrictSelect}
        selectedDistricts={selectedDistricts}
      />
      <Polygon
        positions={points.map(({ coordinates }) => coordinates)}
        pathOptions={{ color: 'red' }}
      />
      <Detector setBounds={setBounds} setZoom={setZoom} handleClick={() => {}} />
    </MapContainer>
  )
}

export default MapPage
