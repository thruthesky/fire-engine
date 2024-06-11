
import {AndroidConfig, ApnsConfig, FcmOptions, WebpushConfig} from "firebase-admin/messaging";


/**
 * Basic interface for sending a message
 *
 * Note that, the image is optional and is not the required field for sending a message
 */
export interface MessageNotification {
    title: string;
    body: string;
    image?: string;
}

/**
 *
 */
export interface MessageRequest extends MessageNotification {
    tokens: Array<string>;
    data?: { [key: string]: string };
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


/**
 * Interface for push notification payload.
 */
export interface MessagePayload {
    notification: MessageNotification;
    data: {
        [key: string]: string;
    };
    token: string;
    success?: boolean;
    code?: string;

    android?: AndroidConfig;
    webpush?: WebpushConfig;
    apns?: ApnsConfig;
    fcmOptions?: FcmOptions;
}


