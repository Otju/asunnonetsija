import { FilterField, ParsedApartmentInfo, SearchOptions } from '../../../types'
import Slider from './Slider'
import { findMinMax } from '../utils/findMinMax'

const FilterSettings: React.FC<{
  apartmentInfos: ParsedApartmentInfo[]
  setSearchOptions: Function
  searchOptions: SearchOptions
  filterFields: FilterField[]
}> = ({ apartmentInfos, setSearchOptions, searchOptions, filterFields }) => {
  const settingsWithMinMax = filterFields.map((filter) => {
    const { min, max } = findMinMax(apartmentInfos, filter.name)
    return { ...filter, defaultMin: min, defaultMax: max }
  })

  return (
    <>
      {settingsWithMinMax.map(({ name, ...props }) => {
        const existingValues = searchOptions.filterSettings.find((setting) => setting.name === name)
        const handleChange = (values: readonly number[]) => {
          const newValues = existingValues
            ? searchOptions.filterSettings.map((setting) =>
                setting.name === name ? { ...setting, min: values[0], max: values[1] } : setting
              )
            : [...searchOptions.filterSettings, { name: name, min: values[0], max: values[1] }]
          setSearchOptions({ ...searchOptions, filterSettings: newValues })
        }
        return (
          <Slider
            key={name}
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

export default FilterSettings
