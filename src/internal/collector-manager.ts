export interface CollectorManager {
    isReady(): Promise<boolean>;
    prepare(): Promise<void>;
    startCollecting(): Promise<void>;
    stopCollecting(): Promise<void>;
}
