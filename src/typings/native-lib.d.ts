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
				export module messaging {
					export class AccelerometerRecordsMessagingService {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.AccelerometerRecordsMessagingService>;
						public constructor();
						public static setMessageListenerServiceDelegate(param0: es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate): void;
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
					export class AccelerometerResultMessageService {
						public static class: java.lang.Class<es.uji.geotec.wearos_sensors.messaging.AccelerometerResultMessageService>;
						public constructor();
						public static setMessageListenerServiceDelegate(param0: es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate): void;
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

//Generics information:

