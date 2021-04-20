import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/dist/styles.min.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { useState } from 'react'
import { Detector, CustomMarker } from './components'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { ParsedApartmentInfo } from '../../sharedTypes/types'

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
  apartmentInfo: ParsedApartmentInfo[]
}> = ({ apartmentInfo }) => {
  const defaultZoom = 10
  const [bounds, setBounds] = useState<Bounds>()
  const [zoom, setZoom] = useState(defaultZoom)

  let apartments = apartmentInfo

  console.log(bounds)
  /*
  apartments = apartments.filter(({ coordinates }) => {
    const { lat, lon } = coordinates
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
  */

  const markers = apartments.map((apartment) => <CustomMarker apartmentInfo={apartment} />)

  console.log(zoom)

  return (
    <>
      <MapContainer center={[60.232, 24.91]} zoom={defaultZoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>{markers}</MarkerClusterGroup>
        <Detector setBounds={setBounds} setZoom={setZoom} handleClick={() => {}} />
      </MapContainer>
    </>
  )
}

export default MapPage
