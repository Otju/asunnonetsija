import { FC, ReactNode } from 'react'
import { IconType } from 'react-icons'
import { ParsedApartmentInfo } from '../../../types'
import { getInfoBoxes } from '../utils/apartmentParsers'

const InfoBox: FC<{ header: string; info: string | ReactNode; Icon: IconType }> = ({
  info,
  header,
  Icon,
}) => (
  <div className="infoBox">
    {<Icon size={30} className="icon" />}
    <div className="info">
      <span className="valueHeader">{header}</span>
      <span className="value">{info}</span>
    </div>
  </div>
)

const ApartmentCard: FC<{ info: ParsedApartmentInfo }> = ({ info }) => {
  const infoBoxes = getInfoBoxes(info)
  return (
    <div className="apartmentCard">
      {infoBoxes.map(({ header, info, icon }) => (
        <InfoBox header={header} info={info} Icon={icon} key={header} />
      ))}
    </div>
  )
}

export default ApartmentCard
