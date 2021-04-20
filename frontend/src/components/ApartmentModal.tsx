import { ParsedApartmentInfo } from '../sharedTypes/types'
import ApartmentCard from './ApartmentCard'

const ApartmentModal: React.FC<{
  info: ParsedApartmentInfo
  isVisible: boolean
  setInvisible: (event: React.MouseEvent<HTMLElement>) => void
}> = ({ info, isVisible, setInvisible }) => {
  return isVisible ? (
    <div className="modal">
      <div onClick={setInvisible} className="modalCloseDiv"></div>
      <div className="modal-content">
        <ApartmentCard info={info} />
      </div>
    </div>
  ) : null
}

export default ApartmentModal
