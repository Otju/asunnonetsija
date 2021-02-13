import { Marker, useMapEvents, useMap, Polygon } from 'react-leaflet'
import L, { LatLng, LeafletEventHandlerFnMap } from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { District } from '../../../../types'
import { useEffect } from 'react'

export const DistrictPolygons: React.FC<{
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

export const DraggablePoint: React.FC<{
  coordinates: LatLng
  handleDrag: Function
  id: number
}> = ({ coordinates, handleDrag, id }) => {
  const circle = (
    <svg height="20" width="20">
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

export const Detector: React.FC<{
  setBounds: Function
  setZoom: Function
  handleClick: Function
}> = ({ setBounds, setZoom, handleClick }) => {
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
