import { useMapEvents, useMap, Polygon } from 'react-leaflet'
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
