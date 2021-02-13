import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from '../../assets/houseLocation.svg'
import { Coordinates, District } from '../../../../types'
import { useState } from 'react'
import { DistrictPolygons, DraggablePoint, Detector } from './components'
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
  setPoints: Function
  points: Points[]
}> = ({ houseCoordinates, districts, setPoints, points }) => {
  const iconAsHTML = ReactDOMServer.renderToString(<Icon width={50} height={60} />)
  const iconHouse = new L.DivIcon({
    html: iconAsHTML,
    iconAnchor: [25, 60],
    className: 'dummy',
  })
  const defaultZoom = 10
  const [bounds, setBounds] = useState<Bounds>()
  const [zoom, setZoom] = useState(defaultZoom)
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])

  const insert = (arr: any[], index: number, newItem: any) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index),
  ]

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }
  const getDistance = (from: LatLng, to: LatLng) => {
    const lat1 = from.lat
    const lat2 = to.lat
    const lon1 = from.lng
    const lon2 = to.lng
    const earthRadius = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadius * c
  }

  const handleClick = (coordinates: LatLng) => {
    const newPoint = { id: points.length /*Date.now()*/, coordinates }
    if (points.length >= 3) {
      const distanceToOtherPoints = points.map((point) => {
        const distance = getDistance(coordinates, point.coordinates)
        return { ...point, distance }
      })
      const [closest, second] = distanceToOtherPoints
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)
      const indexOfClosest = points.findIndex(({ id }) => id === closest.id)
      const indexOfSecond = points.findIndex(({ id }) => id === second.id)
      const index = indexOfSecond > indexOfClosest ? indexOfSecond + 1 : indexOfClosest + 1
      const newPoints = insert(points, index, newPoint)
      console.log(indexOfClosest, indexOfSecond, newPoints)
      setPoints(newPoints)
    } else {
      const newPoints = [...points, newPoint]
      setPoints(newPoints)
    }
  }

  const handleDistrictSelect = (name: string, selected: boolean) => {
    const newDistricts = selected
      ? selectedDistricts.filter((itemName) => itemName !== name)
      : [...selectedDistricts, name]
    setSelectedDistricts(newDistricts)
  }

  houseCoordinates = houseCoordinates.sort()

  let markerCoordinates: Coordinates[] = []

  let markers
  if (zoom > 13) {
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
    markers = markerCoordinates.map(({ lat, lon }, i) => (
      <Marker position={[lat, lon]} icon={iconHouse} key={i} />
    ))
  }

  const handleDrag = (coordinates: LatLng, id: number) => {
    const newPoints = points.map((point) => (point.id === id ? { id, coordinates } : point))
    setPoints(newPoints)
  }

  return (
    <MapContainer center={[60.232, 24.91]} zoom={defaultZoom} scrollWheelZoom={false}>
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
      {points.map(({ coordinates, id }) => (
        <DraggablePoint coordinates={coordinates} handleDrag={handleDrag} id={id} />
      ))}
      <Detector setBounds={setBounds} setZoom={setZoom} handleClick={handleClick} />
    </MapContainer>
  )
}

export default MapPage
