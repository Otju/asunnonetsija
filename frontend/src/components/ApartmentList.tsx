import ApartmentCard from './ApartmentCard'
import { FC } from 'react'
import { ParsedApartmentInfo } from '../../../types'

const ApartmentList: FC<{ apartmentInfos: ParsedApartmentInfo[] }> = ({ apartmentInfos }) => {
  return (
    <div className="apartmentList">
      {apartmentInfos.map((info) => info && <ApartmentCard info={info} key={info.link} />)}
    </div>
  )
}

export default ApartmentList
