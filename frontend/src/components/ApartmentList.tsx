import ApartmentCard from './ApartmentCard'
import { getApartmentInfos } from '../utils/apartmentParsers'

const ApartmentList = () => {
  const apartmentInfos = getApartmentInfos()

  return (
    <div className="apartmentList">
      {apartmentInfos
        .sort((a, b) => a.totalFees - b.totalFees)
        .slice(0, 30)
        .map((info) => info && <ApartmentCard info={info} key={info.link} />)}
    </div>
  )
}

export default ApartmentList
