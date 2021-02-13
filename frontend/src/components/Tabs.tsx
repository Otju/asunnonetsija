import { useState } from 'react'
import LoanSettings from './LoanSettings'
import {
  LoanSettings as LoanSettingsType,
  ParsedApartmentInfo,
  SearchOptions,
} from '../../../types'
import { generalFilterFields, travelFilterFields } from '../utils/constants'
import FilterSettings from './FilterSettings'
import MapPage, { Points } from './MapPage'
import smallDistricts from '../assets/smallDistricts.json'
const Tabs: React.FC<{
  apartmentInfos: ParsedApartmentInfo[]
  setSearchOptions: Function
  searchOptions: SearchOptions
}> = ({ apartmentInfos, setSearchOptions, searchOptions }) => {
  const [tab, setTab] = useState(3)

  const setLoanVariables = (loanSettings: LoanSettingsType) => {
    setSearchOptions({ ...searchOptions, loanSettings })
  }

  const setPoints = (points: Points[]) => {
    setSearchOptions({ ...searchOptions, points })
  }

  const points = searchOptions.points

  const districts = smallDistricts.filter(({ name }) =>
    apartmentInfos.find(({ smallDistrict }) => {
      return smallDistrict === name
    })
  )

  let tabToShow
  switch (tab) {
    case 0:
      tabToShow = (
        <FilterSettings
          apartmentInfos={apartmentInfos}
          setSearchOptions={setSearchOptions}
          searchOptions={searchOptions}
          filterFields={generalFilterFields}
        />
      )
      break
    case 1:
      tabToShow = (
        <FilterSettings
          apartmentInfos={apartmentInfos}
          setSearchOptions={setSearchOptions}
          searchOptions={searchOptions}
          filterFields={travelFilterFields}
        />
      )
      break
    case 2:
      tabToShow = (
        <LoanSettings
          loanVariables={searchOptions.loanSettings}
          setLoanVariables={setLoanVariables}
        />
      )
      break
    case 3:
      tabToShow = (
        <MapPage
          houseCoordinates={apartmentInfos.map((info) => info.coordinates).filter((item) => item)}
          districts={districts}
          points={points}
          setPoints={setPoints}
        />
      )
      break
    default:
      tabToShow = <>Page missing</>
      break
  }
  const tabs = [
    { name: 'Haku', value: 0 },
    { name: 'Matka-ajat', value: 1 },
    { name: 'Laina', value: 2 },
    { name: 'Kartta', value: 3 },
  ]
  return (
    <div className="bordered">
      {tabs.map(({ name, value }) => (
        <span
          onClick={() => setTab(value)}
          className={`tabButton ${value === tab && 'selectedTabButton'}`}
          key={name}
        >
          {name}
        </span>
      ))}
      <div className="searchOptionsMenu">{tabToShow}</div>
    </div>
  )
}

export default Tabs
