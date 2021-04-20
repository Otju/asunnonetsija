import { useMapEvents, useMap, Polygon } from 'react-leaflet'
import { District, ParsedApartmentInfo } from '../../sharedTypes/types'
import { useEffect } from 'react'
import { Marker } from 'react-leaflet'
import ReactDOMServer from 'react-dom/server'
import { ReactComponent as Icon } from '../../assets/houseLocation.svg'
import ApartmentModal from '../ApartmentModal'
import L from 'leaflet'
import { useState } from 'react'

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

export const Detector: React.FC<{
  setBounds: Function
  setZoom: Function
  handleClick: Function
}> = ({ setBounds, setZoom, handleClick }) => {
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
      setZoom(e.target.getZoom())
    },
    dblclick: (e) => {
      handleClick(e.latlng)
    },
  })
  return null
}

const disableMap = (map: L.Map) => {
  map.dragging.disable()
  map.touchZoom.disable()
  map.doubleClickZoom.disable()
  map.scrollWheelZoom.disable()
  map.boxZoom.disable()
  map.keyboard.disable()
  if (map.tap) {
    map.tap.disable()
    //@ts-ignore
    document.getElementById('map').style.cursor = 'default'
  }
}

const enableMap = (map: L.Map) => {
  map.dragging.enable()
  map.touchZoom.enable()
  map.doubleClickZoom.enable()
  map.scrollWheelZoom.enable()
  map.boxZoom.enable()
  map.keyboard.enable()
  if (map.tap) {
    map.tap.enable()
    //@ts-ignore
    document.getElementById('map').style.cursor = 'grab'
  }
}

const iconAsHTML = ReactDOMServer.renderToString(<Icon width={50} height={60} />)
const iconHouse = new L.DivIcon({
  html: iconAsHTML,
  iconAnchor: [25, 60],
  className: 'dummy',
})

export const CustomMarker: React.FC<{
  apartmentInfo: ParsedApartmentInfo
}> = ({ apartmentInfo }) => {
  const { coordinates } = apartmentInfo
  const { lat, lon } = coordinates
  const [modalIsVisible, setModalisVisible] = useState(false)
  const map = useMap()
  return (
    <>
      <Marker
        position={[lat, lon]}
        icon={iconHouse}
        key={apartmentInfo.link}
        eventHandlers={{
          click: () => {
            setModalisVisible(true)
            disableMap(map)
          },
        }}
      />
      <ApartmentModal
        info={apartmentInfo}
        isVisible={modalIsVisible}
        setInvisible={() => {
          setModalisVisible(false)
          enableMap(map)
        }}
      />
    </>
  )
}
