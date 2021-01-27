import apartmentInfos from '../assets/apartmentInfos.json'
import ApartmentCard from './ApartmentCard'

const ApartmentList = () => {
  return (
    <div className="flex column align-center">
      {apartmentInfos.slice(0, 10).map((info) => info && <ApartmentCard info={info} />)}
    </div>
  )
}

export default ApartmentList
