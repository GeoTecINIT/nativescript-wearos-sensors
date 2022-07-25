import { TriAxialSensorSample } from "nativescript-wearos-sensors/internal/sensors/triaxial/sample";

export function getFakeTriAxialData() {
    return {
        timestamp: Date.now(),
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
    };
}

export function buildFakeEncodedMessage(expectedSamples: TriAxialSensorSample[]) {
    const bytes = Array.create("byte", (4 + (20) * expectedSamples.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedSamples.length);
    expectedSamples.forEach((sample) => {
        buff.putFloat(sample.x);
        buff.putFloat(sample.y);
        buff.putFloat(sample.z);
        buff.putLong(sample.timestamp);
    })

    return bytes;
}
