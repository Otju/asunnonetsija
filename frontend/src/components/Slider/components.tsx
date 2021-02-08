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
}

export const Handle: React.FC<HandleProps> = ({
  handle: { id, value, percent },
  unit,
  index,
  getHandleProps,
}) => {
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
      >
        {value}
        {unit}
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
