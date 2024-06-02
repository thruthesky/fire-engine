

/**
 * Interface for sending multiple messages with multiple tokens.
 *
 * @title: Title of the message
 * @body: Body of the message
 * @tokens: Array of tokens to send the message to
 * @data: Additional data to be sent
 */
export interface SendMultiMessages {
    title: string;
    body: string;
    tokens: string | string[];
    data?: { [key: string]: unknown };
    shortErrorMessage?: boolean;
    maxConcurrent?: number;
}

/**
 * Interface for sending a single message
 *
 * @title: Title of the message
 * @body: Body of the message
 * @token: Token to send the message to
 * @data: Additional data to be sent
 */
export interface SendOneMessage {
    title: string;
    body: string;
    token: string;
    data?: { [key: string]: unknown };
    accessToken: string;
    shortErrorMessage?: boolean;
}

/**
 * Interface for sending message when a user likes another user
 */
export interface UserLikeEvent {
    senderUid: string;
    receiverUid: string;
}


/**
 * Inteface for sendNotificationToUids
 *
 * @uids: Array of uids to send the message to
 * @title: Title of the message
 * @body: Body of the message
 * @data: Additional data to be sent
 */
export interface NotificationToUids {
    uids: Array<string>;
    title: string;
    body: string;
    data?: { [key: string]: unknown };
}

