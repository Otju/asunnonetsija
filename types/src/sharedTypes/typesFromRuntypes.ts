import * as allRuntypes from './runtypes'
import { Static } from 'runtypes' 

export type Renovation = Static<typeof allRuntypes.Renovation>

export type Coordinates = Static<typeof allRuntypes.Coordinates>

export type TravelTime = Static<typeof allRuntypes.TravelTime>

export type ApartmentInfo = Static<typeof allRuntypes.ApartmentInfo>