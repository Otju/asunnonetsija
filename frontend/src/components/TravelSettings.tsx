import {
  TravelFilterField,
  ParsedApartmentInfo,
  SearchOptions,
  PossibleDestination,
} from '../../../types'
import Slider from './Slider'
import { travelFilterMinMax } from '../utils/findMinMax'

const TravelSettings: React.FC<{
  apartmentInfos: ParsedApartmentInfo[]
  setSearchOptions: Function
  searchOptions: SearchOptions
}> = ({ apartmentInfos, setSearchOptions, searchOptions }) => {
  const possibleDestinations: PossibleDestination[] = [
    'Aalto Yliopisto',
    'Helsingin Yliopisto',
    'Papinmäentie 15 B',
    'Helsingin rautatieasema',
  ]

  let travelFilterFields: TravelFilterField[] = possibleDestinations.map((destination) => ({
    displayName: destination,
    defaultMax: 120,
    unit: 'min',
    destination: destination,
  }))

  travelFilterFields = travelFilterFields.map((filterField) => {
    const { min, max } = travelFilterMinMax(apartmentInfos, filterField.destination)
    return { ...filterField, defaultMin: min, defaultMax: max }
  })

  return (
    <>
      {travelFilterFields.map(({ destination, ...props }) => {
        const existingValues = searchOptions.travelTimeFilterSettings.find(
          ({ name }) => name === destination
        )
        const handleChange = (values: readonly number[]) => {
          const newValues = existingValues
            ? searchOptions.travelTimeFilterSettings.map((setting) =>
                setting.name === destination
                  ? { ...setting, min: values[0], max: values[1] }
                  : setting
              )
            : [
                ...searchOptions.travelTimeFilterSettings,
                { name: destination, min: values[0], max: values[1] },
              ]
          setSearchOptions({
            ...searchOptions,
            travelTimeFilterSettings: newValues,
          })
        }
        return (
          <Slider
            key={destination}
            {...props}
            handleChange={handleChange}
            min={existingValues?.min}
            max={existingValues?.max}
          />
        )
      })}
    </>
  )
}

export default TravelSettings
