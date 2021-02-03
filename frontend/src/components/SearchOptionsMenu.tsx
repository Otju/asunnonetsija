import { FC } from 'react'
import { SearchOption } from '../../../types'
import Slider from './Slider'

const SearchOptionsMenu: FC<{ searchOptions: SearchOption[]; setSearchOptions: Function }> = ({
  searchOptions,
  setSearchOptions,
}) => {
  return (
    <div className="bordered">
      <h2>Etsi</h2>
      <div style={{ width: '40%' }}>
        {searchOptions.map(({ field, ...props }) => (
          <Slider
            key={field}
            {...props}
            setMinMax={(min: number, max: number) =>
              setSearchOptions(
                searchOptions.map((searchOption) =>
                  searchOption.field === field ? { ...searchOption, min, max } : searchOption
                )
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

export default SearchOptionsMenu
