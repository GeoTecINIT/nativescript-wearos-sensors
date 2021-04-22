/// <reference path="android-declarations.d.ts"/>

declare module es {
	export module uji {
		export module geotec {
			export module wearos_sensors {
				export class BuildConfig {
					public static class: java.lang.Class<es.uji.geotec.wearos_sensors.BuildConfig>;
					public static DEBUG: boolean;
					public static LIBRARY_PACKAGE_NAME: string;
					public static BUILD_TYPE: string;
					public constructor();
				}
			}
		}
	}
}

declare module es {
	export module uji {
		export module geotec {
			export module wearos_sensors {
				export class WearSensor {
					public static class: java.lang.Class<es.uji.geotec.wearos_sensors.WearSensor>;
					public static ACCELEROMETER: es.uji.geotec.wearos_sensors.WearSensor;
					public static GYROSCOPE: es.uji.geotec.wearos_sensors.WearSensor;
					public static values(): native.Array<es.uji.geotec.wearos_sensors.WearSensor>;
					public static valueOf(param0: string): es.uji.geotec.wearos_sensors.WearSensor;
				}
			}
		}
	}
}

declare module es {
	export module uji {
		export module geotec {
			export module wearos_sensors {
				export module messaging {
					export class MessageReceiverActivationCache {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.MessageReceiverActivationCache>;
						public constructor(param0: com.google.android.gms.wearable.MessageEvent);
						public getMessageEvent(): com.google.android.gms.wearable.MessageEvent;
					}
				}
			}
		}
	}
}

declare module es {
	export module uji {
		export module geotec {
			export module wearos_sensors {
				export module messaging {
					export class WearableListenerServiceDelegate {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate>;
						/**
						 * Constructs a new instance of the es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
						});
						public constructor();
						public onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
					}
				}
			}
		}
	}
}

declare module es {
	export module uji {
		export module geotec {
			export module wearos_sensors {
				export module messaging {
					export class WearosSensorsRecordsMessagingService {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.WearosSensorsRecordsMessagingService>;
						public constructor();
						public static setRecordServiceDelegate(param0: es.uji.geotec.wearos_sensors.WearSensor, param1: es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate): void;
						public onCreate(): void;
						public onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
					}
				}
			}
		}
	}
}

declare module es {
	export module uji {
		export module geotec {
			export module wearos_sensors {
				export module messaging {
					export class WearosSensorsResultsMessagingService {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.WearosSensorsResultsMessagingService>;
						public constructor();
						public onCreate(): void;
						public static setResultServiceDelegate(param0: es.uji.geotec.wearos_sensors.WearSensor, param1: es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate): void;
						public onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
					}
				}
			}
		}
	}
}

//Generics information:

