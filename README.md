# nativescript-wearos-sensors
[![npm](https://img.shields.io/npm/v/nativescript-wearos-sensors.svg)](https://www.npmjs.com/package/nativescript-wearos-sensors)
[![npm](https://img.shields.io/npm/dm/nativescript-wearos-sensors.svg)](https://www.npmjs.com/package/nativescript-wearos-sensors)

The _nativescript-wearos-sensors_ is a plugin developed with the
[`NativeScript`](https://nativescript.org) framework. It allows to develop smartphone applications for collecting 
data from the IMU sensors (i.e., accelerometer and gyroscope), the magnetometer, the heart rate and the GPS of a paired
Android WearOS smartwatch (if the corresponding sensor is available in the device).

The Android WearOS smartwatch must run a counterpart application built using the native [_WearOS Sensors_](https://github.com/GeoTecINIT/WearOSSensors) library.
Then, the smartphone application can request the smartwatch to start/stop the collection of the specified sensor, and
the smartwatch will send the collected samples to the smartphone application.

> [!WARNING] 
> An application using this plugin is completely useless if there is not a counterpart application
> build with the _WearOS Sensors_ library installed in the paired smartwatch. In other words, the smartphone can not
> work by itself alone. It requires a smartwatch to work.

The data collection can be started both from the smartphone and from the paired smartwatch. In addition. the plugin offers
a way to communicate with the smartwatch by sending messages.

## Installation
Run the following command in your project's root folder.

```bash
ns plugin add nativescript-wearos-sensors
```

## Requirements
This plugin is **only supported** by Android smartphones. To use it to build an application, the following requirements apply:

- An Android smartphone running Android 6 (API level 23) or higher. 
- In addition, the smartphone must be paired with a smartwatch with the counterpart application installed. To link a smartwatch 
 to the smartphone, you must also install the [Smartwatch WearOS by Google](https://play.google.com/store/apps/details?id=com.google.android.wearable.app) or the specific application provided 
 by the smartwatch manufacturer (e.g., Mobvoi Health, Samsung Wearable, etc.) and follow the procedure to link both devices.

> [!IMPORTANT] 
> Both applications (smartphone and smartwatch apps) must have the same application id.
> If that's not the case, the applications will not be able to interact. You can change the application id of a 
> NativeScript application in the `nativescript.config.ts`.

## Usage 
The plugin offers two features:

- [Sensor data collection](#sensor-data-collection) from the paired smartwatch: it can be started/stopped from the smartphone and from the smartwatch.
  The smartwatch is able to start and stop the data collection thanks to the WearCommands feature.
- [Plain Messaging](#plainmessaging): it allows to send and receive simple messages between both devices.

In first place, you need to initialize the plugin with a [`WearosSensorsConfig`](#wearossensorsconfig) in your app.ts (TypeScript app) or main.ts (Angular app) file:

```typescript
// TypeScript App:
import { Application } from "@nativescript/core";
// or Angular App:
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app/app.module";

// WearOSSensors import
import { wearosSensors, allSensors } from "nativescript-wearos-sensors";

wearosSensors.init({
    sensors: allSensors,
    disablePlainMessaging: false,
    disableWearCommands: false
});

// TypeScript App:
Application.run({ moduleName: "app-root" });
// Angular App:
platformNativeScriptDynamic().bootstrapModule(AppModule);
```

The initialization parameter is optional, and it allows specifying which sensors are enabled (`sensors`), and if PlainMessaging
(`disablePlainMessaging`) and WearCommands (`disableWearCommands`) features are enabled. The default configuration is
the one shown in the example above: all sensors and features enabled.

> [!NOTE] 
> The configuration allows to conditionally wire up native components with the core of the plugin. This allows
> to reduce the memory used by the application when some features are not going to be used.

### Sensor data collection
As stated above, the data collection can be started/stopped by both devices, but only the smartphone has access to
the collected data. 

To receive the collected data, the smartphone has to register a listener (at least one) via the
[`CollectorManager`](#collectormanager). A listener can be set up for a specific node/s (i.e., smartwatch) and a specific sensor/s. This means
that there can be several listeners registered, all of them listening for different nodes or sensors. This behaviour can be
achieved using `ListenerFilters`. Here's an example of registering different listeners:

```typescript
import { getCollectorManager } from "nativescript-wearos-sensors/collection";
import { SensorRecord } from "nativescript-wearos-sensors/sensors/records";
import { Node } from "nativescript-wearos-sensors/node";
import { ListenerFilter } from "nativescript-wearos-sensors/listeners";
import { SensorType } from "nativescript-wearos-sensors/sensors";


function registerGlobalListener() {
    // Register a listener witout filters --> receives records from all sources
    getCollectorManager().addSensorListener((sensorRecord: SensorRecord<any>) => {
        console.log(deviceId, JSON.stringify(sensorRecord));
    });
}

function registerListenerForNode(node: Node) {
    // Register a listener filtering per node --> receives all kind of records from that node
    const filter: ListenerFilter = {
        nodes: [node]
    }
    getCollectorManager().addSensorListener((sensorRecord: SensorRecord<any>) => {
        console.log(deviceId, JSON.stringify(sensorRecord));
    }, filter);
}

function registerListenerForSensor(sensor: SensorType) {
    // Register a listener filtering per sensor --> receives records of that sensor from any node
    const filter: ListenerFilter = {
        sensors: [sensor]
    }
    getCollectorManager().addSensorListener((sensorRecord: SensorRecord<any>) => {
        console.log(deviceId, JSON.stringify(sensorRecord));
    }, filter);
}

function registerListenerForNodeAndSensors(node: Node, sensors: SensorType[]) {
    // Register a listener filtering per node and sensor --> receives records of that sensors from that node
    const filter: ListenerFilter = {
        nodes: [node],
        sensors: sensors
    }
    getCollectorManager().addSensorListener((sensorRecord: SensorRecord<any>) => {
        console.log(deviceId, JSON.stringify(sensorRecord));
    }, filter);
}
```

#### Start/stop data collection from smartphone
In order to start the data collection for node, first you have to get the connected nodes using the [`NodeDiscoverer`](#nodediscoverer).
Then, once you have the connected node, you have to follow some steps to start the data collection:

1. Check if a specific sensor on the node is ready to be collected from.
2. If it is not ready:
   1. It is because the sensor is not present in the device.
   2. The sensor is in the device, but the smartwatch app has no permissions to collect from that sensor.
3. If we lack of permissions, we can just ask the user to grant them.
   1. If permissions are rejected, it's the end of the way...
   2. If permissions are granted, we can start the collection!!

To start the data collection, we also should specify a `CollectionConfiguration`, where we can indicate the desired
time between consecutive samples (`sensorDelay`), and the amount of samples to deliver each time (`batchSize`). The 
configuration is optional, if no configuration is provided then default values apply.

> [!NOTE]
> Due to the smartwatch has to send the collected data via Bluetooth, we can't send individual samples when working
> with a high sampling rate. That would saturate the connection. To solve this problem, we send the samples in batches.
   
Here is an example of this collection procedure:

```typescript
import { getNodeDiscoverer } from "nativescript-wearos-sensors/node";
import { getCollectorManager, PrepareError, CollectionConfiguration } from "nativescript-wearos-sensors/collection";
import { Node } from "nativescript-wearos-sensors/node";
import { SensorType } from "nativescript-wearos-sensors/sensors";

async function getNodes(): Promise<Node[]> {
    await nodesDiscovered = nodeDiscoverer.getConnectedNodes();
    const nodes = []
    nodesDiscovered.forEach((nodeDiscovered) => {
        if (nodeDiscovered.error) {
            this.logger.logResult(nodeDiscovered.error);
            return;
        }
        nodes.push(nodeDiscovered.node);
    });
    return nodes;
}

async function collectFrom(node: Node, sensor: SensorType, config: CollectionConfiguration) {
    const collectorManager = getCollectorManager();
    
    const isReady = await collectorManager.isReady(node, sensor);
    if (!isReady) {
        const prepareError: PrepareError = await collectorManager.prepare(node, sensor);
        if (prepareError) {
            console.log(prepareError.message);
            return;
        }
    }
    
    await collectorManager.startCollecting(node, sensor, config);
}

async function stopCollecingFrom(node: Node, sensor: SensorType) {
    await collectorManager.stopCollecting(node, sensor);
}
```

#### Start/stop data collection from smartwatch
The plugin fully handles this for you. You only have to make sure to register at least a listener to receive
the collected data.

> [!IMPORTANT] 
> The WearCommands feature must be enabled at plugin initialization.


### PlainMessaging
With a system composed by several devices, it is important to have a way to communicate. We provide the 
[`PlainMessageClient`](#plainmessageclient), which allows to send and
receive string based messages. There are two types of received messages: the ones which require a response and the
ones which don't. Here's an example on how to use the messaging feature:

```typescript
import { getPlainMessageClient } from "src/internal/communication/plain-message";

function registerListener(): void {
    // Register a listener to receive messages from the smartwatch
    getPlainMessageClient().registerListener((receivedMessage) => {
        console.log(`received single message ${JSON.stringify(receivedMessage)}`);
    });
}

async function sendMessage(node: Node, message: string): void {
    // Send a message to the smartwatch
    const plainMessage = {message: "You don't have to reply :)"};
    await getPlainMessageClient().send(node, plainMessage);
}

async function sendMessageAndWaitResponse(node: Node, message: string): void {
    // Send a message to the smartwatch and wait for a response
    const plainMessage = {message: "PING!"};
    const receivedMessage = await getPlainMessageClient().sendExpectingResponse(node, plainMessage);
    console.log(`response received: ${JSON.stringify(receivedMessage)}`);
}
```

> [!IMPORTANT] 
> The PlainMessaging feature must be enabled at plugin initialization.

## API

### wearosSensors - Methods

| Name                                 | Return type     | Description                                                                                                                           |
|--------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `init(config?: WearosSensorsConfig)` | `Promise<void>` | Initializes the native components depending on the provided configuration. If no configuration provided, defaults to `defaultConfig`. |

#### [`WearosSensorsConfig`](src/wearos-sensors.common.ts)

| Property                 | Type           | Description                                              |
|--------------------------|----------------|----------------------------------------------------------|
| `sensors?`               | `SensorType[]` | Sensors that are going to be used. Default: all sensors. |
| `disablePlainMessaging?` | `boolean`      | Disable plain messaging feature. Default: false.         |
| `disableWearCommands?`   | `boolean`      | Disable wear commands feature. Default: false.           |

##### `defaultConfig`

```typescript
export const defaultConfig = {
    sensors: allSensors, // Constant containing all the sensors
    disablePlainMessaging: false,
    disableWearCommands: false
};
```

### [`NodeDiscoverer`](src/internal/node/discoverer/node-discoverer.android.ts)

| Function                                    | Return type                | Description                                                                                                                                                        |
|---------------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `getLocalNode()`                            | `Promise<Node>`            | Get a reference to the local node (smartphone).                                                                                                                    |
| `areConnectedNodes()`                       | `Promise<boolean>`         | Returns true if there are connected nodes.                                                                                                                         |
| `getConnectedNodes(timeout: number = 5000)` | `Promise<NodeDiscovered[]` | Get the currently connected nodes and their available sensors. Timeout indicates the maximum wait time for the connected nodes to communicate with the smartphone. |

#### [`Node`](src/internal/node/index.ts)

| Field          | Type           | Description                               |
|----------------|----------------|-------------------------------------------|
| `name`         | `string`       | Name of the device.                       |
| `id`           | `string`       | Id number of the device.                  |
| `capabilities` | `SensorType[]` | Sensors that are available on the device. |


#### [`NodeDiscovered`](src/internal/node/discoverer/node-discoverer.ts)

| Field    | Type   | Description                                                                                                     |
|----------|--------|-----------------------------------------------------------------------------------------------------------------|
| `node`   | `Node` | Reference to a Node.                                                                                            |
| `error?` | `any`  | An error message. Present if the Node was not able to communicate with the smartphone in the specified timeout. |


### [`SensorType`](src/internal/sensors/sensor-type.ts)

| Value           | Description                          |
|-----------------|--------------------------------------|
| `ACCELEROMETER` | Represents the accelerometer sensor. |
| `GYROSCOPE`     | Represents the gyroscope sensor.     |
| `MAGNETOMETER`  | Represents the magnetometer sensor.  |
| `HEART_RATE`    | Represents the heart rate sensor.    |
| `LOCATION`      | Represents the GPS sensor.           |


### [`CollectorManager`](src/internal/collection/android/collector-manager-impl.android.ts)

| Method                                                                             | Return type             | Description                                                                                                                                                            |
|------------------------------------------------------------------------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isEnabled(sensor: SensorType)`                                                    | `boolean`               | Returns true if the sensor type is enabled in the initial configuration.                                                                                               |
| `isReady(node: Node, sensor: SensorType)`                                          | `Promise<boolean>`      | Return true if the sensor is ready to collect data from.                                                                                                               |
| `prepare(node: Node, sensor: SensorType)`                                          | `Promise<PrepareError>` | Returns a `PrepareError` if anything failed in the preparation (e.g., sensor unavailable, no permissions, etc). Returns `undefined` if the preparation was successful. |
| `startCollecting(node: Node, sensor: SensorType, config?: CollectionConfiguration` | `Promise<void>`         | Starts the data collection of a sensor in a node with the specified configuration.                                                                                     |
| `stopCollecting(node: Node, sensor: SensorType)`                                   | `Promise<void>`         | Stops the data collection of a sensor in a node.                                                                                                                       |
| `addSensorListener(listener: SensorListener, filters?: ListenerFilter)`            | `number`                | Adds a listener with the specified filters and returns a listener identifier.                                                                                          |
| `removeSensorListener(listenerId?: number)`                                        | `void`                  | Removes the listener specified by the `listenerId`. If not provided, removes all listeners.                                                                            |

#### `PrepareError`

| Property  | Type     | Description                                              |
|-----------|----------|----------------------------------------------------------|
| `node`    | `Node`   | Reference to the Node where the PrepareError comes from. |
| `message` | `string` | Message describing the error.                            |

#### `CollectionConfiguration`

| Property         | Type             | Description                                                                                       |
|------------------|------------------|---------------------------------------------------------------------------------------------------|
| `sensorInterval` | `SensorInterval` | Time between each consecutive sample. Can be a `NativeSensorInterval` or a value in milliseconds. |
| `batchSize`      | `number`         | Amount of samples to be sent in each record.                                                      |


#### `SensorListener`

`(sensorRecord: SensorRecord<any>) => void`

#### `ListenerFilter`

| Property   | Type           | Description                                     |
|------------|----------------|-------------------------------------------------|
| `nodes?`   | `Node[]`       | For which nodes the related listener applies.   |
| `sensors?` | `SensorType[]` | For which sensors the related listener applies. |

> [!TIP]
> Filter works as follows:
> ```typescript
> { 
>   nodes: [node1, /* OR */ node2]
>   // AND
>   sensors: [SensorType.ACCELEROMETER, /* OR */ SensorType.GYROSCOPE]
> }
> ```

### [`SensorRecord`](src/internal/sensors/sensor-record.ts)

| Property   | Type         | Description                                                                                            |
|------------|--------------|--------------------------------------------------------------------------------------------------------|
| `type`     | `SensorType` | Type of the collected data.                                                                            |
| `deviceId` | `string`     | Id of the device where the collected data comes from.                                                  |
| `samples`  | `T[]`        | List of samples, where T is `TriAxialSensorSample`, `HeartRateSensorSample`, or `LocationSensorSample` |

#### [`TriAxialSensorSample`](src/internal/sensors/triaxial/sample.ts)

| Property  | Type      | Description    |
|-----------|-----------|----------------|
| `x`       | `number`  | Component _x_. |
| `y`       | `number`  | Component _y_. |
| `z`       | `number`  | Component _z_. |


#### [`HeartRateSensorSample`](src/internal/sensors/heart-rate/sample.ts)

| Property | Type      | Description       |
|----------|-----------|-------------------|
| `value`  | `number`  | Heart rate value. |


#### [`LocationSensorSample`](src/internal/sensors/location/sample.ts)

| Property             | Type     | Description                                                  |
|----------------------|----------|--------------------------------------------------------------|
| `latitude`           | `number` | Latitude coordinate component.                               |
| `longitude`          | `number` | Longitude coordinate component.                              |
| `altitude`           | `number` | Altitude coordinate component.                               |
| `verticalAccuracy`   | `number` | Estimated error in the latitude.                             |
| `horizontalAccuracy` | `number` | Estimated error in the longitude.                            |
| `speed`              | `number` | Estimated device's speed when the location was acquired.     |
| `direction`          | `number` | Estimated device's direction when the location was acquired. |


### [`PlainMessageClient`](src/internal/communication/plain-message/android/plain-message-client.android.ts)

| Function                                                                          | Return type                | Description                                                                        |
|-----------------------------------------------------------------------------------|----------------------------|------------------------------------------------------------------------------------|
| `enabled()`                                                                       | `boolean`                  | Returns true if the plain message feature is enabled in the initial configuration. |
| `registerListener(listener: PlainMessageListener)`                                | `void`                     | Registers the listener for the feature.                                            |
| `unregisterListener()`                                                            | `void`                     | Unregisters the listener for the feature.                                          |
| `send(node: Node, plainMessage: PlainMessage)`                                    | `Promise<void>`            | Sends a message to the specified Node.                                             |
| `sendExpectingResponse(node: Node, plainMessage: PlainMessage, timeout?: number)` | `Promise<ReceivedMessage>` | Sends a message to the specified Node and wait `timeout` ms for a response.        |

#### `PlainMessage`

| Property        | Type           | Description                                                                                                                             |
|-----------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `message`       | `string`       | Content of the message.                                                                                                                 |
| `inResponseTo?` | `PlainMessage` | Contains the message at which the current message is responding. `undefined` means that the message is not responding to other message. |

#### `ReceivedMessage`

| Property       | Type           | Description                          |
|----------------|----------------|--------------------------------------|
| `senderNodeId` | `string`       | Id of the node who sent the message. |
| `PlainMessage` | `PlainMessage` | Message received.                    |

#### `PlainMessageListener`

`(receivedMessage: ReceivedMessage) => void`
    
## License

Apache License 2.0

See [LICENSE](LICENSE).


## Author

<a href="https://github.com/matey97" title="Miguel Matey Sanz">
  <img src="https://avatars3.githubusercontent.com/u/25453537?s=120" alt="Miguel Matey Sanz" width="120"/>
</a>


## Acknowledgements

The development of this library has been possible thanks to the Spanish Ministry of Universities (grant FPU19/05352).
