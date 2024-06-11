import {getMessaging} from "firebase-admin/messaging";
import {MessageNotification, MessagePayload, MessageRequest} from "./messaging.interfaces";


/* eslint-disable valid-jsdoc */

/**
 * MessagingService
 *
 * It provides functionalities related to messaging in the application,
 * such as sending notifications and handling message events.
 */
export class MessagingService {
    /**
     * Android configuration for the message.
     *
     * This is thee default configuration for the message.
     */
    static android = {
        notification: {
            sound: "default",
        },
    };

    /**
     * APNS configuration for the message
     *
     * This is the default configuration for the message.
     */
    static apns = {
        payload: {
            aps: {
                sound: "default",
            },
        },
    };


    /**
     * Send messages
     *
     * @param {MessageRequest} params - The parameters for sending messages.
     * params.tokens - The list of tokens to send the message to.
     * params.title - The title of the message.
     * params.body - The body of the message.
     * params.image - The image of the message.
     * params.data - The extra data of the message.
     *
     *
     * It returns the error results of push notification in a map like
     * below. And it only returns the tokens that has error results.
     * The tokens that succeed (without error) will not be returned.
     *
     * ```
     * {
     *   'fVWDxKs1kEzx...Lq2Vs': '',
     *   'wrong-token': 'messaging/invalid-argument;addiontional error message',
     * }
     * ```
     *
     * If there is no error with the token, the value will be empty
     * string. Otherwise, there will be a error message.
     *
     *
     */
    static async sendNotificationToTokens(params: MessageRequest): Promise<{ [token: string]: string; }> {
        const promises = [];

        if (typeof params.tokens != "object") {
            throw new Error("tokens must be an array of string");
        }
        if (params.tokens.length == 0) {
            throw new Error("tokens must not be empty");
        }
        if (!params.title) {
            throw new Error("title must not be empty");
        }
        if (!params.body) {
            throw new Error("body must not be empty");
        }


        // Remove empty tokens
        const tokens = params.tokens.filter((token) => !!token);


        // Image is optional
        const notification: MessageNotification = {title: params.title, body: params.body};
        if (params.image) {
            notification["image"] = params.image;
        }

        // send the notification message to the list of tokens
        for (const token of tokens) {
            const message: MessagePayload = {
                notification: notification,
                data: params.data ?? {},
                token: token,
                android: MessagingService.android,
                apns: MessagingService.apns,
            };
            console.log("message: ", message);
            promises.push(getMessaging().send(message));
        }

        // Wait for all the promises to be resolved (even if some of them are rejected)
        const res = await Promise.allSettled(promises);

        // Return the error responses only. For the successful responses, it does not need to return them.
        const responses: { [token: string]: string; } = {};
        for (let i = 0; i < res.length; i++) {
            const status: string = res[i].status;
            console.log("status; ", status, res[i]);
            if (status == "fulfilled") {
                continue;
            } else {
                const reason = (res[i] as PromiseRejectedResult).reason;
                responses[tokens[i]] = reason["errorInfo"]["code"] + ":::" + reason["errorInfo"]["message"];
            }
        }
        return responses;
    }
}


