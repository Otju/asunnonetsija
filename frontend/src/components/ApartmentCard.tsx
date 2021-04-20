import { ParsedApartmentInfo } from '../sharedTypes/types'
import { getInfoBoxes } from '../utils/apartmentParsers'
import InfoBoxGrop from './InfoBoxGroup'

const ApartmentCard: React.FC<{ info: ParsedApartmentInfo }> = ({ info }) => {
  const generalInfoBoxes = getInfoBoxes(info)
  const feeInfoBoxes = getInfoBoxes(info, 'fees')
  const pointsOfIntrestBoxes = getInfoBoxes(info, 'pointsOfIntrest')
  return (
    <div className="apartmentCard boxed">
      <div className="horizontalInfo">
        <InfoBoxGrop infoBoxes={generalInfoBoxes} />
        <InfoBoxGrop infoBoxes={pointsOfIntrestBoxes} />
      </div>
      <InfoBoxGrop infoBoxes={feeInfoBoxes} vertical />
    </div>
  )
}

export default ApartmentCard
