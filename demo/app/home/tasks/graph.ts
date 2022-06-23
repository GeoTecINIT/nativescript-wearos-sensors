import { EventListenerGenerator, RunnableTaskDescriptor, TaskGraph } from "nativescript-task-dispatcher/tasks/graph";

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        // Records logs
        on("accelerometerRecordsAcquired", run("recordLoggerTask"));
        on("gyroscopeRecordsAcquired", run("recordLoggerTask"));
        on("magnetometerRecordsAcquired", run("recordLoggerTask"));
        on("heartRateRecordsAcquired", run("recordLoggerTask"));
        on("locationRecordsAcquired", run("recordLoggerTask"));
    }
}

export const demoTaskGraph = new DemoTaskGraph();
