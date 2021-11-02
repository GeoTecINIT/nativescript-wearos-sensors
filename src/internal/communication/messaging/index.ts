export interface MessagingProtocol {
    readyProtocol: ResultMessagingProtocol;
    prepareProtocol: ResultMessagingProtocol;
    startMessagePath: string;
    stopMessagePath: string;
    newRecordMessagePath: string;
}

export interface ResultMessagingProtocol {
    messagePath: string;
    successResponse: string;
    failureResponse: string;
}

