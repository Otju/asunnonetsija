import { Coordinates } from './sharedTypes/typesFromRuntypes'
import pointInPolygon from 'point-in-polygon'

export const latLonToNumberArray = ({ lat, lon }: Coordinates): number[] => [lat, lon]

export const latLonArrayToNumberArrayArray = (coordinates: Coordinates[]): number[][] =>
  coordinates.map((item) => latLonToNumberArray(item))

export const NumberArrayArrayToCoordinates = (coordinates: number[][]): Coordinates[] =>
  coordinates.map((item) => ({ lat: item[0], lon: item[1] }))

export const isInPolygon = (pointCoordinates: Coordinates, polygonCoordinates: Coordinates[]) =>
  pointInPolygon(
    latLonToNumberArray(pointCoordinates),
    polygonCoordinates.map((item) => latLonToNumberArray(item))
  )
