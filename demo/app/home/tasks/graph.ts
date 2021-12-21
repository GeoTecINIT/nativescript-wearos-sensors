import { EventListenerGenerator, RunnableTaskDescriptor, TaskGraph } from "nativescript-task-dispatcher/tasks/graph";

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        on("requestStartCommand", run("commandLoggerTask"));

        on("requestStartCommand", run("accelerometerStartSensorTask"));
        on("requestStartCommand", run("gyroscopeStartSensorTask"));
        on("requestStartCommand", run("magnetometerStartSensorTask"));
        on("requestStartCommand", run("heartRateStartSensorTask"));
        on("requestStartCommand", run("locationStartSensorTask"));

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
