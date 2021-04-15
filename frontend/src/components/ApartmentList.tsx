import ApartmentCard from './ApartmentCard'

import { ParsedApartmentInfo } from '../sharedTypes/types'

const ApartmentList: React.FC<{ apartmentInfos: ParsedApartmentInfo[] }> = ({ apartmentInfos }) => {
  return (
    <div className="apartmentList">
      {apartmentInfos.map((info) => info && <ApartmentCard info={info} key={info.link} />)}
    </div>
  )
}

export default ApartmentList
