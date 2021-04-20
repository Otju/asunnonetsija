import { ParsedApartmentInfo } from '../sharedTypes/types'
import ApartmentCard from './ApartmentCard'
import ApartmentModal from './ApartmentModal'
import { useState } from 'react'

const ApartmentCardWithModal: React.FC<{ info: ParsedApartmentInfo }> = ({ info }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false)

  return (
    <>
      <div onClick={() => setModalIsVisible(true)}>
        <ApartmentCard info={info} />
      </div>
      <ApartmentModal
        info={info}
        isVisible={modalIsVisible}
        setInvisible={() => setModalIsVisible(false)}
      />
    </>
  )
}

export default ApartmentCardWithModal
