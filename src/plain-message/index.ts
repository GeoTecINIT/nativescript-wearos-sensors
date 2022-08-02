export { getPlainMessageClient } from "../internal/communication/plain-message";
import {
    PlainMessage as FM,
    PlainMessageListener as FL,
    ReceivedMessage as RM
} from "../internal/communication/plain-message";
export type PlainMessage = FM;
export type PlainMessageListener = FL;
export type ReceivedMessage = RM;

import { PlainMessageClient as FMC } from "../internal/communication/plain-message/plain-message-client";
export type PlainMessageClient = FMC;