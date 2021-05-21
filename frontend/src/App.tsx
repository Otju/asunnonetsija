import './app.scss'
import { useState, useEffect } from 'react'
import ApartmentList from './components/ApartmentList'
import {
  ParsedApartmentInfo,
  SearchOptions,
  PossibleDestination,
  ApartmentInfoField,
} from './sharedTypes/types'
import { getApartmentInfos } from './utils/apartmentParsers'
import Tabs from './components/Tabs'
import { possibleDestinations } from './utils/constants'

const App = () => {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    filterSettings: [],
  })

  const [rawData, setRawData] = useState()

  const getData = async () => {
    const url = 'https://raw.githubusercontent.com/Otju/aparmentInfoData/main/apartmentInfos.json'
    const rawData = await (await fetch(url)).json()
    setRawData(rawData)
  }

  useEffect(() => {
    getData()
  }, [])

  if (!rawData) {
    return (
      <div className="pageLoadingDiv">
        <h2>Ladataan asuntoja...</h2>
        <div className="lds-dual-ring"></div>
      </div>
    )
  }
  //@ts-ignore
  const apartmentInfos = getApartmentInfos(rawData, searchOptions?.loanSettings)

  const filterApartments = (apartment: ParsedApartmentInfo): boolean => {
    let keep = true
    searchOptions.filterSettings.forEach(({ name, min, max }) => {
      const value = possibleDestinations.includes(name as PossibleDestination)
        ? apartment.pointsOfIntrest.find((item) => item.name === name)?.directDistance
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
