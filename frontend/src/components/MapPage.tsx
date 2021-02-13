import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polygon } from 'react-leaflet'
import L, { LatLng, LeafletEventHandlerFnMap } from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from '../assets/houseLocation.svg'
import { Coordinates, District } from '../../../types'
import { useEffect, useState } from 'react'

const DistrictPolygons: React.FC<{
  districts: District[]
  handleDistrictSelect: (name: string, selected: boolean) => void
  selectedDistricts: string[]
}> = ({ districts, handleDistrictSelect, selectedDistricts }) => {
  return (
    <>
      {districts.map(({ coordinates, name }) => {
        const selected = selectedDistricts.find((item) => item === name)
        const eventHandlers = {
          click: () => {
            handleDistrictSelect(name, Boolean(selected))
          },
        }
        const color = selected ? 'red' : 'black'
        return (
          <Polygon
            pathOptions={{ fillColor: color, color }}
            weight={1}
            positions={coordinates.map(([lng, lat]) => ({ lat, lng }))}
            key={name}
            eventHandlers={eventHandlers}
          />
        )
      })}
    </>
  )
}

const Detector: React.FC<{ setBounds: Function; setZoom: Function; handleClick: Function }> = ({
  setBounds,
  setZoom,
  handleClick,
}) => {
  const map = useMap()
  map.doubleClickZoom.disable()
  useEffect(() => {
    setBounds(map.getBounds())
  }, [map, setBounds])

  useMapEvents({
    dragend: (e) => {
      setBounds(e.target.getBounds())
    },
    zoomend: (e) => {
      setBounds(e.target.getBounds())
      setZoom(e.target.getZoom())
    },
    dblclick: (e) => {
      handleClick(e.latlng)
    },
  })
  return null
}

const DraggablePoint: React.FC<{ coordinates: LatLng; handleDrag: Function; id: number }> = ({
  coordinates,
  handleDrag,
  id,
}) => {
  const circle = (
    <svg>
      <circle cx="10" cy="10" r="10" fill="red" />
    </svg>
  )

  const circleAsHtml = ReactDOMServer.renderToString(circle)
  const circleIcon = new L.DivIcon({
    html: circleAsHtml,
    iconAnchor: [10, 10],
    className: 'dummy',
  })

  const eventHandlers: LeafletEventHandlerFnMap = {
    dragend: (e) => {
      handleDrag(e.target.getLatLng(), id)
    },
  }
  return <Marker position={coordinates} eventHandlers={eventHandlers} draggable icon={circleIcon} />
}

const MapPage: React.FC<{ houseCoordinates: Coordinates[]; districts: District[] }> = ({
  houseCoordinates,
  districts,
}) => {
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

  interface Points {
    coordinates: LatLng
    id: number
  }

  const defaultZoom = 10
  const [bounds, setBounds] = useState<Bounds>()
  const [zoom, setZoom] = useState(defaultZoom)
  const [points, setPoints] = useState<Points[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])

  const handleClick = (coordinates: LatLng) => {
    const newPoint = { id: Date.now(), coordinates }
    setPoints([...points, newPoint])
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
