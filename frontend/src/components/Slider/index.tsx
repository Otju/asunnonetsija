import { FC, useState } from 'react'
import { Slider, Handles, Tracks, Rail, Ticks } from 'react-compound-slider'
import { Handle, Track, Tick } from './components'
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
    <div>
      <h4>{displayName}</h4>
      {trueMax && (
        <button className="trueMaxButton" onClick={() => setShowTrueMax(!showTrueMax)}>
          {showTrueMax ? '-' : '+'}
        </button>
      )}
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
        <Ticks count={2}>
          {({ ticks }) => (
            <div>
              {ticks.map((tick) => (
                <Tick key={tick.id} tick={tick} count={ticks.length} unit={unit} />
              ))}
            </div>
          )}
        </Ticks>
      </Slider>
    </div>
  )
}

export default CustomSlider
