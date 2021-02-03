import './app.scss'
import { useState } from 'react'
import ApartmentList from './components/ApartmentList'
import SearchOptionMenu from './components/SearchOptionsMenu'
import { SearchOption } from '../../types'

const App = () => {
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
