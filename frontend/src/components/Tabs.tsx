import { useState } from 'react'
import LoanSettings from './LoanSettings'
import GeneralSettings from './GeneralSettings'
import TravelSettings from './TravelSettings'
import {
  LoanSettings as LoanSettingsType,
  ParsedApartmentInfo,
  SearchOptions,
} from '../../../types'

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
        <GeneralSettings
          apartmentInfos={apartmentInfos}
          setSearchOptions={setSearchOptions}
          searchOptions={searchOptions}
        />
      )
      break
    case 1:
      tabToShow = (
        <TravelSettings
          apartmentInfos={apartmentInfos}
          setSearchOptions={setSearchOptions}
          searchOptions={searchOptions}
        />
      )
      break
    default:
      tabToShow = (
        <LoanSettings
          loanVariables={searchOptions.loanSettings}
          setLoanVariables={setLoanVariables}
        />
      )
      break
  }
  const tabs = [
    { name: 'Haku', value: 0 },
    { name: 'Matka-ajat', value: 1 },
    { name: 'Laina-asetukset', value: 2 },
  ]
  return (
    <div className="bordered">
      {tabs.map(({ name, value }) => (
        <button onClick={() => setTab(value)} className="tabButton" key={name}>
          {name}
        </button>
      ))}
      <div className="searchOptionsMenu">{tabToShow}</div>
    </div>
  )
}

export default Tabs
