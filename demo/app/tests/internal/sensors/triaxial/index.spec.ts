import { TriAxialSensorRecord } from "nativescript-wearos-sensors/internal/sensors/triaxial/record";

export function getFakeTriAxialData() {
    return {
        timestamp: Date.now(),
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
    };
}

export function buildFakeEncodedMessage(expectedRecords: TriAxialSensorRecord[]) {
    const bytes = Array.create("byte", (4 + (20) * expectedRecords.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedRecords.length);
    expectedRecords.forEach((record) => {
        buff.putFloat(record.x);
        buff.putFloat(record.y);
        buff.putFloat(record.z);
        buff.putLong(record.timestamp);
    })

    return bytes;
}
