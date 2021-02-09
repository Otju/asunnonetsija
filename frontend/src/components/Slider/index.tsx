import { Slider, Handles, Tracks, Rail, Ticks } from 'react-compound-slider'
import { Handle, Track, Tick } from './components'
interface SliderProps {
  displayName: string
  defaultMin?: number
  defaultMax: number
  handleChange: (values: readonly number[]) => void
  unit?: string
  notRange?: boolean
  defaultValue?: number
  step?: number
  min?: number
  max?: number
  value?: number
}

const CustomSlider: React.FC<SliderProps> = ({
  defaultMin = 0,
  defaultMax,
  displayName,
  handleChange,
  unit = '',
  notRange,
  defaultValue,
  step = 1,
  min,
  max,
  value,
}) => {
  const setMin = (newMin: number) => {
    const maxToSet = max || defaultMax
    if (newMin >= maxToSet) {
      newMin = maxToSet - step
    }
    if (newMin < defaultMin) {
      newMin = defaultMin
    }
    handleChange([newMin, maxToSet])
  }

  const setMax = (newMax: number) => {
    const minToSet = min || defaultMin
    if (newMax <= minToSet) {
      newMax = minToSet + step
    }
    if (newMax > defaultMax) {
      newMax = defaultMax
    }
    handleChange([minToSet, newMax])
  }

  return (
    <div className="sliderContainer">
      <h4>{displayName}</h4>
      <Slider
        className="slider"
        domain={[defaultMin, defaultMax]}
        step={step}
        mode={2}
        values={
          notRange ? [value || defaultValue || defaultMin] : [min || defaultMin, max || defaultMax]
        }
        onChange={handleChange}
      >
        <Rail>{({ getRailProps }) => <div className="rail" {...getRailProps()} />}</Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div>
              {handles.map((handle, i) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  index={i}
                  unit={unit}
                  setMin={setMin}
                  setMax={setMax}
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
        <Ticks values={[defaultMin, defaultMax]}>
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
