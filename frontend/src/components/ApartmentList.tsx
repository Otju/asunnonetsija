import ApartmentCard from './ApartmentCard'
import { FC } from 'react'
import { getApartmentInfos } from '../utils/apartmentParsers'
import { SearchOption, ParsedApartmentInfo } from '../../../types'

const ApartmentList: FC<{ searchOptions: SearchOption[] }> = ({ searchOptions }) => {
  const apartmentInfos = getApartmentInfos()
  console.log(searchOptions)
  const filterApartments = (apartment: ParsedApartmentInfo): boolean => {
    let keep = true
    searchOptions.forEach(({ field, min, max }) => {
      const value = apartment[field]
      if (value) {
        if (max && value > max) {
          keep = false
        }
        if (min && value < min) {
          keep = false
        }
      }
    })
    return keep
  }

  return (
    <div className="apartmentList">
      {apartmentInfos
        .filter(filterApartments)
        .sort((a, b) => a.totalFees - b.totalFees)
        .slice(0, 30)
        .map((info) => info && <ApartmentCard info={info} key={info.link} />)}
    </div>
  )
}

export default ApartmentList
