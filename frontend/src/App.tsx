import './app.scss'
import { useState } from 'react'
import ApartmentList from './components/ApartmentList'
import SearchOptionMenu from './components/SearchOptionsMenu'
import {
  SearchOption,
  PossibleDestination,
  ParsedApartmentInfo,
  ApartmentInfoField,
} from '../../types'
import { getApartmentInfos } from './utils/apartmentParsers'

const App = () => {
  const possibleDestinations: PossibleDestination[] = [
    'Aalto Yliopisto',
    'Helsingin Yliopisto',
    'Papinmäentie 15 B',
    'Helsingin rautatieasema',
  ]

  const destinationSearches: SearchOption[] = possibleDestinations.map((destination) => ({
    field: 'travelTimes',
    displayName: `Matka-aika: ${destination}`,
    defaultMax: 120,
    unit: 'min',
    destination: destination,
  }))

  const apartmentInfos = getApartmentInfos()

  const findMinMax = (
    apartmentInfos: ParsedApartmentInfo[],
    field: ApartmentInfoField,
    destination?: PossibleDestination
  ) => {
    let numberArray = []
    if (field === 'travelTimes') {
      numberArray = apartmentInfos.map(
        (info) => info.travelTimes.find((item) => item.destination === destination)?.duration
      )
    } else {
      numberArray = apartmentInfos.map((info) => info[field])
    }
    const min =
      numberArray.reduce((prev, current) => ((prev || 0) < (current || 0) ? prev : current)) || 0
    const max =
      numberArray.reduce((prev, current) => ((prev || 0) > (current || 0) ? prev : current)) || 0
    return {
      min: Math.floor(min),
      max: Math.ceil(max),
    }
  }
  let initialSearchOptions: SearchOption[] = [
    {
      field: 'totalFees',
      displayName: 'Kokonaiskulut',
      defaultMax: 1200,
      unit: '€/kk',
    },
    {
      field: 'pricePerSqrMeter',
      displayName: 'Neliöhinta',
      defaultMax: 6000,
      unit: '€/m²',
    },
    { field: 'sqrMeters', displayName: 'Pinta-ala', defaultMax: 200, unit: 'm²' },
    ...destinationSearches,
  ]

  initialSearchOptions = initialSearchOptions.map((searchOption) => {
    const { min, max } = findMinMax(apartmentInfos, searchOption.field, searchOption.destination)

    let defaultMax = searchOption.defaultMax

    let noTrueMax = false

    if (defaultMax / max >= 0.7) {
      defaultMax = max
      noTrueMax = true
    }

    return {
      ...searchOption,
      defaultMax: defaultMax,
      defaultMin: min,
      trueMax: noTrueMax ? undefined : max,
    }
  })

  const [searchOptions, setSearchOptions] = useState<SearchOption[]>(initialSearchOptions)

  const filterApartments = (apartment: ParsedApartmentInfo): boolean => {
    let keep = true
    searchOptions.forEach(({ field, min, max, destination }) => {
      const value =
        field === 'travelTimes'
          ? apartment.travelTimes.find((travelTime) => travelTime.destination === destination)
              ?.duration
          : apartment[field]
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
    .sort((a, b) => a.totalFees - b.totalFees)

  return (
    <div className="pageBackground">
      <div className="main">
        <SearchOptionMenu {...{ searchOptions, setSearchOptions }} />
        <h2>Asuntoja: {filteredApartmentInfos.length}</h2>
        <ApartmentList apartmentInfos={filteredApartmentInfos.slice(0, 30)} />
      </div>
    </div>
  )
}

export default App
