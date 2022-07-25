export { getFreeMessageClient } from "../internal/communication/free-message";
import {
    FreeMessage as FM,
    FreeMessageListener as FL,
    ReceivedMessage as RM
} from "../internal/communication/free-message";
export type FreeMessage = FM;
export type FreeMessageListener = FL;
export type ReceivedMessage = RM;

import { FreeMessageClient as FMC } from "../internal/communication/free-message/free-message-client";
export type FreeMessageClient = FMC;