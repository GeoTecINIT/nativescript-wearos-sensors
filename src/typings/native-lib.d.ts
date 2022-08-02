/// <reference path="android-declarations.d.ts"/>

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export class BuildConfig {
					public static class: java.lang.Class<es.uji.geotec.wearossensors.BuildConfig>;
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
			export namespace wearossensors {
				export class MessageReceiverActivationCache {
					public static class: java.lang.Class<es.uji.geotec.wearossensors.MessageReceiverActivationCache>;
					public constructor(param0: com.google.android.gms.wearable.MessageEvent);
					public getMessageEvent(): com.google.android.gms.wearable.MessageEvent;
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export class WearSensor {
					public static class: java.lang.Class<es.uji.geotec.wearossensors.WearSensor>;
					public static ACCELEROMETER: es.uji.geotec.wearossensors.WearSensor;
					public static GYROSCOPE: es.uji.geotec.wearossensors.WearSensor;
					public static MAGNETOMETER: es.uji.geotec.wearossensors.WearSensor;
					public static LOCATION: es.uji.geotec.wearossensors.WearSensor;
					public static HEART_RATE: es.uji.geotec.wearossensors.WearSensor;
					public static values(): androidNative.Array<es.uji.geotec.wearossensors.WearSensor>;
					public static valueOf(param0: string): es.uji.geotec.wearossensors.WearSensor;
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export class WearService {
					public static class: java.lang.Class<es.uji.geotec.wearossensors.WearService>;
					public static CAPABILITY: es.uji.geotec.wearossensors.WearService;
					public static COMMAND: es.uji.geotec.wearossensors.WearService;
					public static PLAIN_MESSAGE: es.uji.geotec.wearossensors.WearService;
					public static values(): androidNative.Array<es.uji.geotec.wearossensors.WearService>;
					public static valueOf(param0: string): es.uji.geotec.wearossensors.WearService;
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export class WearableListenerServiceDelegate {
					public static class: java.lang.Class<es.uji.geotec.wearossensors.WearableListenerServiceDelegate>;
					/**
					 * Constructs a new instance of the es.uji.geotec.wearossensors.WearableListenerServiceDelegate interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
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

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export class WearosService {
					public static class: java.lang.Class<es.uji.geotec.wearossensors.WearosService>;
					public onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
					public constructor();
					public static setServiceDelegate(param0: es.uji.geotec.wearossensors.WearService, param1: es.uji.geotec.wearossensors.WearableListenerServiceDelegate): void;
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export namespace capability {
					export class WearosSensorsCapabilityAdvertiserService extends es.uji.geotec.wearossensors.WearosService {
						public static class: java.lang.Class<es.uji.geotec.wearossensors.capability.WearosSensorsCapabilityAdvertiserService>;
						public constructor();
					}
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export namespace command {
					export class WearosSensorsCommandService extends es.uji.geotec.wearossensors.WearosService {
						public static class: java.lang.Class<es.uji.geotec.wearossensors.command.WearosSensorsCommandService>;
						public constructor();
					}
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export namespace plainmessage {
					export class WearosSensorsPlainMessageService extends es.uji.geotec.wearossensors.WearosService {
						public static class: java.lang.Class<es.uji.geotec.wearossensors.plainmessage.WearosSensorsPlainMessageService>;
						public constructor();
					}
				}
			}
		}
	}
}

declare namespace es {
	export namespace uji {
		export namespace geotec {
			export namespace wearossensors {
				export namespace sensors {
					export class WearosSensorsRecordsMessagingService {
						public static class: java.lang.Class<es.uji.geotec.wearossensors.sensors.WearosSensorsRecordsMessagingService>;
						public constructor();
						public static setRecordServiceDelegate(param0: es.uji.geotec.wearossensors.WearSensor, param1: es.uji.geotec.wearossensors.WearableListenerServiceDelegate): void;
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
			export namespace wearossensors {
				export namespace sensors {
					export class WearosSensorsResultsMessagingService {
						public static class: java.lang.Class<es.uji.geotec.wearossensors.sensors.WearosSensorsResultsMessagingService>;
						public static setResultServiceDelegate(param0: es.uji.geotec.wearossensors.WearSensor, param1: es.uji.geotec.wearossensors.WearableListenerServiceDelegate): void;
						public constructor();
						public onCreate(): void;
						public onMessageReceived(param0: com.google.android.gms.wearable.MessageEvent): void;
					}
				}
			}
		}
	}
}

//Generics information:

