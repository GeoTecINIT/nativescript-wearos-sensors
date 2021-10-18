/// <reference path="android-declarations.d.ts"/>

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
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

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
				export class WearSensor {
					public static class: java.lang.Class<es.uji.geotec.wearos_sensors.WearSensor>;
					public static ACCELEROMETER: es.uji.geotec.wearos_sensors.WearSensor;
					public static GYROSCOPE: es.uji.geotec.wearos_sensors.WearSensor;
					public static MAGNETOMETER: es.uji.geotec.wearos_sensors.WearSensor;
					public static LOCATION: es.uji.geotec.wearos_sensors.WearSensor;
					public static HEART_RATE: es.uji.geotec.wearos_sensors.WearSensor;
					public static values(): native.Array<es.uji.geotec.wearos_sensors.WearSensor>;
					public static valueOf(param0: string): es.uji.geotec.wearos_sensors.WearSensor;
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
				export namespace messaging {
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

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
				export namespace messaging {
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

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
				export namespace messaging {
					export class WearosSensorsCapabilityAdvertiserService {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.WearosSensorsCapabilityAdvertiserService>;
						public constructor();
						public static setCapabilityAdvertiserDelegate(param0: es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate): void;
						public onCreate(): void;
						public onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
					}
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
				export namespace messaging {
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

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearos_sensors {
				export namespace messaging {
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

