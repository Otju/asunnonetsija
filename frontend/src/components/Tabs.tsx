import { useState } from 'react'
import LoanSettings from './LoanSettings'
import {
  LoanSettings as LoanSettingsType,
  ParsedApartmentInfo,
  SearchOptions,
} from '../sharedTypes/types'
import { generalFilterFields, travelFilterFields } from '../utils/constants'
import FilterSettings from './FilterSettings'

const Tabs: React.FC<{
  apartmentInfos: ParsedApartmentInfo[]
  setSearchOptions: Function
  searchOptions: SearchOptions
}> = ({ apartmentInfos, setSearchOptions, searchOptions }) => {
  const [tab, setTab] = useState(0)

  const setLoanVariables = (loanSettings: LoanSettingsType) => {
    setSearchOptions({ ...searchOptions, loanSettings })
  }

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
    default:
      tabToShow = <>Page missing</>
      break
  }
  const tabs = [
    { name: 'Haku', value: 0 },
    { name: 'Matka-ajat', value: 1 },
    { name: 'Laina', value: 2 },
  ]
  return (
    <div className="boxed">
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
