import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from '../assets/houseLocation.svg'
import { Coordinates } from '../../../types'
import { useEffect, useState } from 'react'

const DragDetector: React.FC<{ setBounds: Function }> = ({ setBounds }) => {
  const map = useMap()
  useEffect(() => {
    setBounds(map.getBounds())
  }, [map, setBounds])

  useMapEvents({
    dragend: (e) => {
      setBounds(e.target.getBounds())
    },
    zoomend: (e) => {
      setBounds(e.target.getBounds())
    },
  })
  return null
}

const MapPage: React.FC<{ houseCoordinates: Coordinates[] }> = ({ houseCoordinates }) => {
  const iconAsHTML = ReactDOMServer.renderToString(<Icon width={50} height={60} />)
  const iconHouse = new L.DivIcon({
    html: iconAsHTML,
    iconAnchor: [25, 60],
    className: 'dummy',
  })

  interface BoundsCoordinates {
    lat: number
    lng: number
  }

  interface Bounds {
    _northEast: BoundsCoordinates
    _southWest: BoundsCoordinates
  }

  const [bounds, setBounds] = useState<Bounds>()

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

  if (markerCoordinates.length > 500) {
    markerCoordinates = []
  }

  return (
    <MapContainer center={[60.232, 24.91]} zoom={11} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerCoordinates.map(({ lat, lon }, i) => (
        <Marker position={[lat, lon]} icon={iconHouse} key={i} />
      ))}
      <DragDetector setBounds={setBounds} />
    </MapContainer>
  )
}

export default MapPage
