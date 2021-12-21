import { EventListenerGenerator, RunnableTaskDescriptor, TaskGraph } from "nativescript-task-dispatcher/tasks/graph";

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        on("startAllCommand", run("commandLoggerTask"));
        on("startAccelerometerCommand", run("commandLoggerTask"));
        on("startGyroscopeCommand", run("commandLoggerTask"));
        on("startMagnetometerCommand", run("commandLoggerTask"));
        on("startHeartRateCommand", run("commandLoggerTask"));
        on("startLocationCommand", run("commandLoggerTask"));

        on("startAllCommand", run("accelerometerStartSensorTask"));
        on("startAccelerometerCommand", run("accelerometerStartSensorTask"));

        on("startAllCommand", run("gyroscopeStartSensorTask"));
        on("startGyroscopeCommand", run("gyroscopeStartSensorTask"));

        on("startAllCommand", run("magnetometerStartSensorTask"));
        on("startMagnetometerCommand", run("magnetometerStartSensorTask"));

        on("startAllCommand", run("heartRateStartSensorTask"));
        on("startHeartRateCommand", run("heartRateStartSensorTask"));

        on("startAllCommand", run("locationStartSensorTask"));
        on("startLocationCommand", run("locationStartSensorTask"));


        on("accelerometerRecordsAcquired", run("accelerometerStopSensorTask"));
        on("gyroscopeRecordsAcquired", run("gyroscopeStopSensorTask"));
        on("magnetometerRecordsAcquired", run("magnetometerStopSensorTask"));
        on("heartRateRecordsAcquired", run("heartRateStopSensorTask"));
        on("locationRecordsAcquired", run("locationStopSensorTask"));

        on("accelerometerRecordsAcquired", run("recordLoggerTask"));
        on("gyroscopeRecordsAcquired", run("recordLoggerTask"));
        on("magnetometerRecordsAcquired", run("recordLoggerTask"));
        on("heartRateRecordsAcquired", run("recordLoggerTask"));
        on("locationRecordsAcquired", run("recordLoggerTask"));
    }
}

export const demoTaskGraph = new DemoTaskGraph();
