# nativescript-wearos-sensors
The _nativescript-wearos-sensors_ is a plugin applications developed with the
[`NativeScript`](https://nativescript.org) framework. It allows collecting data from the IMU sensors
(i.e., accelerometer and gyroscope), the magnetometer, the heart rate and the GPS of an Android WearOS
smartwatch (if the corresponding sensor is available in the device).

The Android WearOS smartwatch must run a counterpart application built using the [_WearOSSensors_](https://github.com/GeoTecINIT/WearOSSensors) library.
Then, the smartphone application can request the smartwatch to start/stop the collection of the specified sensor, and
the smartwatch will send the collected samples to the smartphone application.

> **Warning**: An application using this plugin is completely useless if there is not a counterpart application
> build with the _WearOSSensors_ library installed in the paired smartwatch. In other words, the smartphone can not
> work by itself alone. It requires a smartwatch to work.

The data collection can be started both from the smartphone and from the paired smartwatch. In addition. the plugin offers
a way to communicate with the smartwatch by sending messages.

## Installation
Run the following command in your project's root folder.

```bash
ns plugin add nativescript-wearos-sensors
```

## Requirements
This plugin is **only supported** for Android smartphones. To use it to build an application, the following requirements apply:

- An Android smartphone running Android 6 (API level 23) or higher. In addition, the smartphone must be paired
 with a smartwatch with the counterpart application installed.

> **Note**: to link a smartwatch to the smartphone, you must also install the [Smartwatch WearOS by Google](https://play.google.com/store/apps/details?id=com.google.android.wearable.app)
> and follow the procedure to link both devices.

> **Warning**: both applications (smartphone and smartwatch apps) must have the same application id.
> If that's not the case, the applications will not be able to interact.

## Usage 
The plugin offers two features:

- [Sensor data collection](#sensor-data-collection) from the paired smartwatch: it can be started/stopped from the smartphone and from the smartwatch.
  The smartwatch is able to start and stop the data collection thanks to the WearCommands feature.
- [FreeMessaging](#freemessaging): it allows to send and receive simple messages between both devices.

In first place, you need to initialize the plugin in your app.ts (TypeScript app) or main.ts (Angular app) file:

```typescript
// TypeScript App:
import { Application } from "@nativescript/core";
// or Angular App:
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app/app.module";

// WearOSSensors import
import { wearosSensors } from "nativescript-wearos-sensors";
import { allSensors } from "nativescript-wearos-sensors/wearos-sensors.common";

wearosSensors.init({
    sensors: allSensors,
    disableFreeMessaging: false,
    disableWearCommands: false
});

// TypeScript App:
Application.run({ moduleName: "app-root" });
// Angular App:
platformNativeScriptDynamic().bootstrapModule(AppModule);
```

The initialization parameter is optional, and it allows specifying which sensors are enabled (`sensors`), and if FreeMessaging
(`disableFreeMessaging`) and WearCommands (`disableWearCommands`) features are enabled. The default configuration is
the one shown in the example above: all sensors and features enabled.

> **Note**: the configuration allows conditionally wire up native components with the core of the plugin. This allows
> to reduce the memory used by the application when some features are not going to be used.

### Sensor data collection
As stated above, the data collection can be started/stopped by both devices, but only the smartphone has access to
the collected data. 

To receive the collected data, the smartphone has to register a listener (at least one) via the
`CollectorManager`. A listener can be set up for a specific node/s (i.e., smartwatch) and a specific sensor/s. This means
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
In order to start the data collection for node, first you have to get the nodes using the `NodeDiscoverer`. Then, once
you have the connected node, you have to follow some steps to start the data collection:

1. Check if a specific sensor on the node is ready to be collected from.
2. If it is not ready:
   1. It is because the sensor is not present in the device.
   2. The sensor is in the device, but the smartwatch app has no permissions to collect from that sensor.
3. If we lack of permissions, we can just ask the user to grant them.
   1. If permissions are rejected, it's the end of the way...
   2. If permissions are granted, we can start the collection!!

To start the data collection, we also should to specify a `CollectionConfiguration`, where we can indicate the desired
time between consecutive samples (`sensorDelay`), and the amount of samples to deliver each time (`batchSize`). The 
configuration is optional, if no configuration is provided then default values apply.

> **Note**: due to the smartwatch has to send the collected data via Bluetooth, we can't send individual samples when working
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

> **Warning**: the WearCommands feature must be enabled at plugin initialization.


### FreeMessaging
With a system composed by several devices, it is important to have a way to communicate. We provide the 
[`FreeMessageClient`](src/internal/communication/free-message/free-message-client.ts), which allows to send and
receive string based messages. There are two types of received messages: the ones which require a response and the
ones which don't. Here's an example on how to use the messaging feature:

```typescript
import { getFreeMessageClient } from "nativescript-wearos-sensors/internal/communication/free-message";

function registerListener(): void {
    // Register a listener to receive messages from the smartwatch
    getFreeMessageClient().registerListener((receivedMessage) => {
        console.log(`received single message ${JSON.stringify(receivedMessage)}`);
    });
}

async function sendMessage(node: Node, message: string): void {
    // Send a message to the smartwatch
    const freeMessage = { message: "You don't have to reply :)" };
    await getFreeMessageClient().send(node, freeMessage);
}

async function sendMessageAndWaitResponse(node: Node, message: string): void {
    // Send a message to the smartwatch and wait for a response
    const freeMessage = { message: "PING!"};
    const receivedMessage = await getFreeMessageClient().sendExpectingResponse(node, freeMessage);
    console.log(`response received: ${JSON.stringify(receivedMessage)}`);
}
```

> **Warning**: the FreeMessaging feature must be enabled at plugin initialization.

## API

Describe your plugin methods and properties here. See [nativescript-feedback](https://github.com/EddyVerbruggen/nativescript-feedback) for example.
    
| Property | Default | Description |
| --- | --- | --- |
| some property | property default value | property description, default values, etc.. |
| another property | property default value | property description, default values, etc.. |
    
## License

Apache License Version 2.0, January 2004
