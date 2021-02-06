import { useState } from 'react'
import { Slider, Handles, Tracks, Rail, Ticks } from 'react-compound-slider'
import { Handle, Track, Tick } from './components'
interface SliderProps {
  displayName: string
  defaultMin?: number
  defaultMax: number
  trueMax?: number
  handleChange: (values: readonly number[]) => void
  unit?: string
  notRange?: boolean
  defaultValue?: number
  step?: number
}

const CustomSlider: React.FC<SliderProps> = ({
  defaultMin = 0,
  defaultMax,
  trueMax,
  displayName,
  handleChange,
  unit = '',
  notRange,
  defaultValue,
  step = 1,
}) => {
  const [showTrueMax, setShowTrueMax] = useState(false)

  return (
    <div className="sliderContainer">
      <h4>{displayName}</h4>
      <Slider
        className="slider"
        domain={[defaultMin, showTrueMax && trueMax ? trueMax : defaultMax]}
        step={step}
        mode={2}
        values={notRange ? [defaultValue || defaultMin] : [defaultMin, defaultMax]}
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
        <Ticks
          values={
            trueMax && showTrueMax ? [defaultMin, defaultMax, trueMax] : [defaultMin, defaultMax]
          }
        >
          {({ ticks }) => (
            <div>
              {ticks.map((tick) => (
                <Tick key={tick.id} tick={tick} count={ticks.length} unit={unit} />
              ))}
            </div>
          )}
        </Ticks>
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
