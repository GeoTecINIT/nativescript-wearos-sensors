export interface MessagingProtocol {
    startMessagePath: string;
    stopMessagePath: string;
    readyProtocol: ResultMessagingProtocol;
    prepareProtocol: ResultMessagingProtocol;
    newRecordMessagePath: string;
}

export interface ResultMessagingProtocol {
    messagePath: string;
    successResponse: string;
    failureResponse: string;
}

