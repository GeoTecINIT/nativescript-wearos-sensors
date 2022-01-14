import { EventListenerGenerator, RunnableTaskDescriptor, TaskGraph } from "nativescript-task-dispatcher/tasks/graph";

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        // Commands logs
        on("startAllCommand", run("commandLoggerTask"));
        on("stopAllCommand", run("commandLoggerTask"));
        on("startAccelerometerCommand", run("commandLoggerTask"));
        on("stopAccelerometerCommand", run("commandLoggerTask"));
        on("startGyroscopeCommand", run("commandLoggerTask"));
        on("stopGyroscopeCommand", run("commandLoggerTask"));
        on("startMagnetometerCommand", run("commandLoggerTask"));
        on("stopMagnetometerCommand", run("commandLoggerTask"));
        on("startHeartRateCommand", run("commandLoggerTask"));
        on("stopHeartRateCommand", run("commandLoggerTask"));
        on("startLocationCommand", run("commandLoggerTask"));
        on("stopLocationCommand", run("commandLoggerTask"));

        // Accelerometer
        on("startAllCommand", run("accelerometerStartSensorTask"));
        on("startAccelerometerCommand", run("accelerometerStartSensorTask"));
        on("stopAccelerometerCommand", run("accelerometerStopSensorTask"));
        on("stopAllCommand", run("accelerometerStopSensorTask"));

        // Gyroscope
        on("startAllCommand", run("gyroscopeStartSensorTask"));
        on("startGyroscopeCommand", run("gyroscopeStartSensorTask"));
        on("stopGyroscopeCommand", run("gyroscopeStopSensorTask"));
        on("stopAllCommand", run("gyroscopeStopSensorTask"));

        // Magnetometer
        on("startAllCommand", run("magnetometerStartSensorTask"));
        on("startMagnetometerCommand", run("magnetometerStartSensorTask"));
        on("stopMagnetometerCommand", run("magnetometerStopSensorTask"));
        on("stopAllCommand", run("magnetometerStopSensorTask"));

        // Heart Rate
        on("startAllCommand", run("heartRateStartSensorTask"));
        on("startHeartRateCommand", run("heartRateStartSensorTask"));
        on("stopHeartRateCommand", run("heartRateStopSensorTask"));
        on("stopAllCommand", run("heartRateStopSensorTask"));

        // Location
        on("startAllCommand", run("locationStartSensorTask"));
        on("startLocationCommand", run("locationStartSensorTask"));
        on("stopLocationCommand", run("locationStopSensorTask"));
        on("stopAllCommand", run("locationStopSensorTask"));

        // Records logs
        on("accelerometerRecordsAcquired", run("recordLoggerTask"));
        on("gyroscopeRecordsAcquired", run("recordLoggerTask"));
        on("magnetometerRecordsAcquired", run("recordLoggerTask"));
        on("heartRateRecordsAcquired", run("recordLoggerTask"));
        on("locationRecordsAcquired", run("recordLoggerTask"));

        // Save records and store
        on("accelerometerRecordsAcquired", run("accumulatorTask"));
        on("gyroscopeRecordsAcquired", run("accumulatorTask"));
        on("magnetometerRecordsAcquired", run("accumulatorTask"));
        on("heartRateRecordsAcquired", run("accumulatorTask"));
        on("locationRecordsAcquired", run("accumulatorTask"));

        on("storeCollectedData", run("storeCollectedDataTask"));
        on("clearCollectedData", run("clearCollectedDataTask"));

        on("storeCollectedDataTaskFinished", run("storeDataMessageLoggerTask"));
        on("clearCollectedDataTaskFinished", run("clearDataMessageLoggerTask"));
    }
}

export const demoTaskGraph = new DemoTaskGraph();
