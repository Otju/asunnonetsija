import { SearchOption } from '../../../types'
import Slider from './Slider'

const SearchOptionsMenu: React.FC<{
  searchOptions: SearchOption[]
  setSearchOptions: Function
}> = ({ searchOptions, setSearchOptions }) => {
  console.log(searchOptions)

  const isCurrentSearchOption = (
    searchOption: SearchOption,
    field: string,
    destination?: string
  ) => {
    if (searchOption.field === 'travelTimes') {
      return searchOption.destination === destination
    } else {
      return searchOption.field === field
    }
  }

  return (
    <div className="bordered">
      <h2>Etsi</h2>
      <div className="searchOptionsMenu">
        {searchOptions.map(({ field, destination, ...props }) => {
          const handleChange = (values: readonly number[]) =>
            setSearchOptions(
              searchOptions.map((searchOption) =>
                isCurrentSearchOption(searchOption, field, destination)
                  ? { ...searchOption, min: values[0], max: values[1] }
                  : searchOption
              )
            )
          return <Slider key={`${field}${destination}`} {...props} handleChange={handleChange} />
        })}
      </div>
    </div>
  )
}

export default SearchOptionsMenu
