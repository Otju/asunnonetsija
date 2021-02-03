import { FC, ReactNode } from 'react'
import { IconType } from 'react-icons'

export interface InfoBoxType {
  header: string
  info: string | ReactNode
  Icon?: IconType
}

const InfoBox: FC<InfoBoxType> = ({ info, header, Icon }) => (
  <div className="infoBox">
    {Icon && <Icon size={30} className="icon" />}
    <div className="info">
      <span className="valueHeader">{header}</span>
      <span className="value">{info}</span>
    </div>
  </div>
)

export default InfoBox
