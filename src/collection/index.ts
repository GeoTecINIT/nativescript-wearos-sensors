import  { CollectorManager as CM, PrepareError as PE } from "../internal/collection/collector-manager";
export type CollectorManager = CM;
export type PrepareError = PE;

import { CollectionConfiguration as CC } from "../internal/collection/collection-configuration";
export type CollectionConfiguration = CC;

import { SensorInterval as SI } from "../internal/collection/collection-configuration";
export type SensorInterval = SI;

export { NativeSensorDelay } from "../internal/collection/collection-configuration";