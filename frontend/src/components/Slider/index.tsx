import { FC, useState } from 'react'
import { Slider, Handles, Tracks, Rail } from 'react-compound-slider'
import { Handle, Track } from './components'
interface SliderProps {
  displayName: string
  defaultMin?: number
  defaultMax: number
  trueMax?: number
  setMinMax: Function
  unit?: string
}

const CustomSlider: FC<SliderProps> = ({
  defaultMin = 0,
  defaultMax,
  trueMax,
  displayName,
  setMinMax,
  unit = '',
}) => {
  const handleChange = (values: readonly number[]) => {
    setMinMax(values[0], values[1])
  }

  const [showTrueMax, setShowTrueMax] = useState(false)

  return (
    <div className="sliderContainer">
      <h4>{displayName}</h4>
      <Slider
        className="slider"
        domain={[defaultMin, showTrueMax && trueMax ? trueMax : defaultMax]}
        step={1}
        mode={2}
        values={[defaultMin, defaultMax]}
        onChange={handleChange}
      >
        <Rail>{({ getRailProps }) => <div className="rail" {...getRailProps()} />}</Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div>
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  unit={unit}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div>
              {tracks.map(({ id, source, target }) => (
                <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
      {trueMax && (
        <button className="trueMaxButton" onClick={() => setShowTrueMax(!showTrueMax)}>
          {showTrueMax ? '-' : '+'}
        </button>
      )}
    </div>
  )
}

export default CustomSlider
