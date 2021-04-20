import InfoBox, { InfoBoxType } from './InfoBox'

const InfoBoxGrop: React.FC<{ infoBoxes: InfoBoxType[]; vertical?: boolean }> = ({
  infoBoxes,
  vertical,
}) => {
  return (
    <div className={`${vertical ? 'verticalInfo' : 'horizontalInfo'} boxed`}>
      {infoBoxes.map(({ header, info, Icon }) => (
        <InfoBox header={header} info={info} Icon={Icon} key={header} />
      ))}
    </div>
  )
}

export default InfoBoxGrop
