import './app.scss'
import { useState } from 'react'
import ApartmentList from './components/ApartmentList'
import SearchOptionMenu from './components/SearchOptionsMenu'
import { SearchOption, PossibleDestinations } from '../../types'

const App = () => {
  const possibleDestinations: PossibleDestinations[] = [
    'Aalto Yliopisto',
    'Helsingin Yliopisto',
    'Papinmäentie 15 B',
    'Helsingin rautatieasema',
  ]

  const destinationSearches: SearchOption[] = possibleDestinations.map((destination) => ({
    field: 'travelTime',
    displayName: `Matka-aika: ${destination}`,
    defaultMax: 120,
    unit: 'min',
    trueMax: 180,
    destination: destination,
  }))

  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([
    {
      field: 'totalFees',
      displayName: 'Kokonaiskulut',
      defaultMax: 1200,
      unit: '€/kk',
      trueMax: 10000,
    },
    {
      field: 'pricePerSqrMeter',
      displayName: 'Neliöhinta',
      defaultMax: 6000,
      unit: '€/m²',
      trueMax: 12000,
    },
    { field: 'sqrMeters', displayName: 'Koko', defaultMax: 200, unit: 'm²', trueMax: 1000 },
    ...destinationSearches,
  ])
  return (
    <div className="pageBackground">
      <div className="main">
        <SearchOptionMenu {...{ searchOptions, setSearchOptions }} />
        <ApartmentList searchOptions={searchOptions} />
      </div>
    </div>
  )
}

export default App
