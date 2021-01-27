import { FC } from 'react'
import { IconType } from 'react-icons'
import {
  IoHomeOutline,
  IoPricetagOutline,
  IoSquareOutline,
  IoLocationOutline,
} from 'react-icons/io5'
import { ApartmentInfo } from '../../../types'
import roundTo from 'round-to'

const InfoBox: FC<{ header: string; info: string; Icon: IconType }> = ({ info, header, Icon }) => (
  <div className="infoBox">
    <Icon size={30} className="icon" />
    <div className="info">
      <span className="valueHeader">{header}</span>
      <span className="value">{info}</span>
    </div>
  </div>
)
const ApartmentCard: FC<{ info: ApartmentInfo }> = ({ info }) => {
  const address = info.address.split(',')[0]
  const parts = info.address.split(' ')
  const city = parts[parts.length - 1]

  const infoBoxes = [
    {
      header: 'Osoite',
      info: address,
      icon: IoHomeOutline,
    },
    {
      header: 'Asuinalue',
      info: `${info.district}, ${city}`,
      icon: IoLocationOutline,
    },
    {
      header: 'Myyntihinta',
      info: `${roundTo(info.sellingPrice || 0, -3)} €`,
      icon: IoPricetagOutline,
    },
    {
      header: 'Pinta-ala',
      info: `${info.sqrMeters} m²`,
      icon: IoSquareOutline,
    },
  ]

  return (
    <div className="apartmentCard">
      {infoBoxes.map(({ header, info, icon }) => (
        <InfoBox header={header} info={info} Icon={icon} />
      ))}
    </div>
  )
}

export default ApartmentCard
