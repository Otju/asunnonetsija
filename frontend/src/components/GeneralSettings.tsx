import { GeneralFilterField, ParsedApartmentInfo, SearchOptions } from '../../../types'
import Slider from './Slider'
import { generalFilterMinMax } from '../utils/findMinMax'

const GeneralSettings: React.FC<{
  apartmentInfos: ParsedApartmentInfo[]
  setSearchOptions: Function
  searchOptions: SearchOptions
}> = ({ apartmentInfos, setSearchOptions, searchOptions }) => {
  let generalFilterFields: GeneralFilterField[] = [
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
  ]

  generalFilterFields = generalFilterFields.map((filterField) => {
    const { min, max } = generalFilterMinMax(apartmentInfos, filterField.field)
    return { ...filterField, defaultMin: min, defaultMax: max }
  })

  return (
    <>
      {generalFilterFields.map(({ field, ...props }) => {
        const existingValues = searchOptions.generalFilterSettings.find(
          ({ name }) => name === field
        )
        const handleChange = (values: readonly number[]) => {
          const newValues = existingValues
            ? searchOptions.generalFilterSettings.map((setting) =>
                setting.name === field ? { ...setting, min: values[0], max: values[1] } : setting
              )
            : [
                ...searchOptions.generalFilterSettings,
                { name: field, min: values[0], max: values[1] },
              ]
          setSearchOptions({
            ...searchOptions,
            generalFilterSettings: newValues,
          })
        }
        return (
          <Slider
            key={field}
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

export default GeneralSettings
