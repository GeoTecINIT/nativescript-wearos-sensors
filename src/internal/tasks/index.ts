import { Task } from "nativescript-task-dispatcher/tasks";
import { StartSensorTask } from "./start-sensor-task";
import { SensorType } from "../sensors/sensor-type";
import { StopSensorTask } from "./stop-sensor-task";
import { SensorDelay } from "../collection/collection-configuration";

export const internalTasks: Array<Task> = [
    new StartSensorTask(SensorType.ACCELEROMETER),
    new StartSensorTask(SensorType.GYROSCOPE),
    new StartSensorTask(SensorType.MAGNETOMETER),
    new StartSensorTask(
        SensorType.HEART_RATE,
        { sensorDelay: SensorDelay.NORMAL, batchSize: 5 }
    ),
    new StartSensorTask(
        SensorType.LOCATION,
        { sensorDelay: SensorDelay.NORMAL, batchSize: 5 }
    ),

    new StopSensorTask(SensorType.ACCELEROMETER),
    new StopSensorTask(SensorType.GYROSCOPE),
    new StopSensorTask(SensorType.MAGNETOMETER),
    new StopSensorTask(SensorType.HEART_RATE),
    new StopSensorTask(SensorType.LOCATION),
];
