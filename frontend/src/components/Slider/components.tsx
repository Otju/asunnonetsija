import { useEffect, useState } from 'react'
import { GetHandleProps, SliderItem, GetTrackProps } from 'react-compound-slider'

interface TickProps {
  tick: SliderItem
  count: number
  unit: string
}

export const Tick: React.FC<TickProps> = ({ tick, count, unit }) => {
  return (
    <div>
      <div style={{ left: `${tick.percent}%` }} className="tick-mark" />
      <div
        style={{
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
        className="tick-text"
      >
        {tick.value}
        {unit}
      </div>
    </div>
  )
}

interface HandleProps {
  handle: SliderItem
  unit: string
  index: number
  getHandleProps: GetHandleProps
  setMin: (newMin: number) => void
  setMax: (newMax: number) => void
}

export const Handle: React.FC<HandleProps> = ({
  handle: { id, value, percent },
  unit,
  index,
  setMin,
  setMax,
  getHandleProps,
}) => {
  const [selected, setSelected] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleSelect = () => {
    setSelected(true)
    setInputValue(value.toString())
  }

  const handleBlur = () => {
    setSelected(false)
    const newValue = Number.parseFloat(inputValue)
    if (index === 0) {
      setMin(newValue)
    } else {
      setMax(newValue)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
      }}
      className="handle"
      {...getHandleProps(id)}
    >
      <div
        style={{
          position: 'absolute',
          bottom: `${index ? '50px' : ''}`,
        }}
        className="handleText"
        onClick={handleSelect}
      >
        {selected ? (
          <div className="inputContainer">
            <input
              onKeyPress={handleKeyPress}
              value={inputValue}
              onBlur={handleBlur}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
              className="handleInput"
              style={{ width: `${inputValue.length}ch` }}
              type="number"
            ></input>
            <span>{unit}</span>
          </div>
        ) : (
          <>
            {value}
            {unit}
          </>
        )}
      </div>
    </div>
  )
}

interface TrackProps {
  source: SliderItem
  target: SliderItem
  getTrackProps: GetTrackProps
}

export const Track: React.FC<TrackProps> = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      className="track"
      {...getTrackProps()}
    />
  )
}
