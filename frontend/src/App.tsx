import './app.scss'
import { useState } from 'react'
import ApartmentList from './components/ApartmentList'
import {
  ParsedApartmentInfo,
  SearchOptions,
  PossibleDestination,
  ApartmentInfoField,
} from '../../types'
import { getApartmentInfos } from './utils/apartmentParsers'
import Tabs from './components/Tabs'
import { possibleDestinations } from './utils/constants'
import inside from 'point-in-polygon'

const App = () => {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    filterSettings: [],
    points: [],
  })

  const apartmentInfos = getApartmentInfos(searchOptions?.loanSettings)

  const filterApartments = (apartment: ParsedApartmentInfo): boolean => {
    let keep = true
    searchOptions.filterSettings.forEach(({ name, min, max }) => {
      const value = possibleDestinations.includes(name as PossibleDestination)
        ? apartment.travelTimes.find(({ destination }) => destination === name)?.duration
        : apartment[name as ApartmentInfoField]
      if (value) {
        if (max && value > max) {
          keep = false
        }
        if (min && value < min) {
          keep = false
        }
      }
    })
    const points = searchOptions.points
    if (points.length >= 3) {
      const { lat, lon } = apartment.coordinates
      const polygon = points.map(({ coordinates }) => [coordinates.lat, coordinates.lng])
      const insideArea = inside([lat, lon], polygon)
      if (!insideArea) {
        keep = false
      }
    }
    return keep
  }

  const filteredApartmentInfos = apartmentInfos
    .filter(filterApartments)
    .sort((a: ParsedApartmentInfo, b: ParsedApartmentInfo) => a.totalFees - b.totalFees)

  return (
    <div className="pageBackground">
      <div className="main">
        <Tabs
          setSearchOptions={setSearchOptions}
          apartmentInfos={apartmentInfos}
          searchOptions={searchOptions}
        />
        <h2>Asuntoja: {filteredApartmentInfos.length}</h2>
        <ApartmentList apartmentInfos={filteredApartmentInfos.slice(0, 30)} />
      </div>
    </div>
  )
}

export default App
