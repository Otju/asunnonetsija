import { ParsedApartmentInfo } from '../sharedTypes/types'
import { getInfoBoxes } from '../utils/apartmentParsers'
import InfoBoxGrop from './InfoBoxGroup'

const ApartmentCard: React.FC<{ info: ParsedApartmentInfo }> = ({ info }) => {
  const generalInfoBoxes = getInfoBoxes(info)
  const feeInfoBoxes = getInfoBoxes(info, 'fees')
  const travelDurationInfoBoxes = getInfoBoxes(info, 'travelTimes')
  return (
    <div className="apartmentCard bordered">
      <div className="horizontalInfo">
        <InfoBoxGrop infoBoxes={generalInfoBoxes} />
        <InfoBoxGrop infoBoxes={travelDurationInfoBoxes} />
      </div>
      <InfoBoxGrop infoBoxes={feeInfoBoxes} vertical />
    </div>
  )
}

export default ApartmentCard
