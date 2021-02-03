import { FC } from 'react'
import { GetHandleProps, SliderItem, GetTrackProps } from 'react-compound-slider'

interface TickProps {
  tick: SliderItem
  count: number
  unit: string
}

export const Tick: FC<TickProps> = ({ tick, count, unit }) => {
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
  getHandleProps: GetHandleProps
}

export const Handle: FC<HandleProps> = ({
  handle: { id, value, percent },
  unit,
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
      <div style={{ fontSize: 11, marginTop: -35 }}>
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

export const Track: FC<TrackProps> = ({ source, target, getTrackProps }) => {
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
