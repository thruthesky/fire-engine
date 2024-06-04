import * as admin from "firebase-admin";
import axios, {AxiosError} from "axios";
import {NotificationToUids, SendMultiMessages, SendOneMessage, UserLikeEvent} from "./messaging.interfaces";
import {Config} from "../config";
import {chunkArray, dog, getProjectID} from "../library";
import {UserService} from "../user/user.service";
import {UserSettingService} from "../user-setting/user-setting.service";
import {T} from "../texts";


/* eslint-disable valid-jsdoc */

/**
 * MessagingService
 *
 * It provides functionalities related to messaging in the application,
 * such as sending notifications and handling message events.
 */
export class MessagingService {
    /**
     * Asynchronously fetches a short-lived Oauth2 access token from the Firebase Admin SDK.
     *
     * @return {Promise<string>} A promise that resolves to a short-lived Oauth2 access token.
     * If the token cannot be retrieved, an empty string is returned.
     */
    static async getAccessToken(): Promise<string> {
        const accessToken = await admin.app().options.credential?.getAccessToken();
        return accessToken?.access_token ?? "";
    }

    /**
     * Send messages from tokens.
     *
     * @param {SendMultiMessages} message  Message to be sent
     * - message.tokens 값은 콤마로 분리된 여러개의 토큰 또는 배열로된 토큰 일 수 있다.
     * - message.maxConcurrent 값은 최대 병렬 전송 수를 나타낸다. 기본값은 100 이다.
     *
     * @return {Promise<Array<{ [key: string]: unknown }>>} Array of results
     * - 결과는 배열로 리턴된다.
     * - 단, 주의할 것은 입력값 확인을 해서 에러가 있으면, 토큰의 수와 상관없이 첫번째 배열 항목에만 에러 정보를 넣어서 리턴한다.
     * - 토큰을 전송 할 때, access token 을 가져오지 못하면 마찬가지로 첫번째 배열 항목에 에러 정보를 넣어서 리턴한다.
     *
     */
    static async sendMulti(message: SendMultiMessages): Promise<Array<{ [key: string]: unknown }>> {
        // ---- 입력 값 체크 ---
        //
        if (!message.tokens) {
            return [{code: "messaging/missing-tokens", message: "tokens is required"}];
        }
        // 토큰인 문자열로 들어오면, 배열로 변환한다.
        if (typeof message.tokens === "string") {
            message.tokens = (message.tokens as string).split(",");
        }
        if (message.tokens.length === 0) {
            return [{code: "messaging/missing-tokens", message: "tokens is required"}];
        }
        if (!message.title) {
            return [{code: "messaging/missing-title", message: "title is required"}];
        }
        if (!message.body) {
            return [{code: "messaging/missing-body", message: "body is required"}];
        }


        // Firebase Admin SDK 에서 short-lived OAuth2 access token 을 가져온다. Bearer 토큰으로 사용한다.
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
            return [{code: "messaging/failed-to-get-access-token", message: "Failed to get access token"}];
        }


        // Chunk the array of tokens. The maximum number of tokens in a chunk is 200.
        // 최대 200개 단위로 토큰을 나눈다.
        const _size = message.maxConcurrent ?? Config.fcmMaxConcurrentConnections;
        const chunkSize = _size > 200 ? 200 : _size;
        const chunks: string[][] = chunkArray(message.tokens, chunkSize);

        const results: Array<{ [key: string]: string }> = [];

        // Promise.allSettled() 를 통해서 토큰을 chunkSize 만큼 나누어서 병렬로 전송한다.
        for (const chunk of chunks) {
            console.log("chunkSize:", chunkSize, ", no of tokens in chunk:", chunk.length, ", chunk:", chunk);
            const promises = chunk.map((token) => this.sendOne({
                token,
                title: message.title,
                body: message.body,
                accessToken,
                shortErrorMessage: message.shortErrorMessage,
            }));
            const re = await Promise.allSettled(promises);

            results.push(...re.map((r) => {
                return r.status === "fulfilled" ? r.value : r.reason;
            }));
        }
        return results;
    }


    /**
     * Send a single message
     *
     * Note, it does not support the image, yet.
     * To support the image, you need to create a new target in Xcode.
     * And there are much work to consider. It's not working if you just add the image to the message.
     * Due to the complexity, it is not supported yet.
     *
     * @param {SendOneMessage} message Message to send
     * @return {Promise} result of the message sending
     */
    private static async sendOne(message: SendOneMessage): Promise<{ [key: string]: unknown }> {
        const accessToken = message.accessToken ?? await this.getAccessToken();

        try {
            const projectID = getProjectID();
            const re = await axios.post("https://fcm.googleapis.com/v1/projects/" + projectID + "/messages:send", {
                "message": {
                    token: message.token,
                    notification: {
                        title: message.title,
                        body: message.body,
                    },
                    data: message.data,
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken,
                },
            });
            console.log("sendOne: success: re:", re.data);
            return {code: "", token: message.token, message: ""};
        } catch (e) {
            if (e instanceof AxiosError) {
                const error = e.response?.data.error;
                const details = error?.details[0];
                delete error.details;

                if (message.shortErrorMessage) {
                    return {
                        code: "messaging/send-one-error",
                        status: error.status,
                        token: message.token,
                    };
                }
                return {
                    code: "messaging/send-one-error",
                    message: "axios.post failed with",
                    token: message.token,
                    error,
                    details,
                };
            } else {
                console.error(e);
                return {
                    code: "messaging/send-one-error-unknown",
                    token: message.token,
                    message: "axios.post failed with",
                };
            }
        }
    }


    /**
     * Send a notification to a list of uids.
     *
     * @param {NotificationToUids} message  Message to be sent
     * - message.uids: Array of uids to send the message to
     * - message.chunkSize: Maximum number of uids in a chunk
     * - message.title: Title of the message
     * - message.body: Body of the message
     * - message.data: Additional data to be sent
     * - message.shortErrorMessage: If true, only the error message is returned
     * - message.maxConcurrent: Maximum number of concurrent connections
     *
     * @return {Promise<Array<{ [key: string]: string }>>} Array of results
     * - The result is returned as an array.
     * - If there is an error, the error information is added to each array item and returned.
     */
    static async sendNotificationToUids(message: NotificationToUids): Promise<Array<{ [key: string]: unknown }>> {
        const uids = message.uids;
        if (!uids) {
            return [{code: "messaging/missing-uids", message: "uids is required"}];
        }
        if (uids.length === 0) {
            return [{code: "messaging/missing-uids", message: "uids is required"}];
        }
        const tokens = await UserService.getTokens(uids);
        if (tokens.length === 0) {
            return [{code: "messaging/missing-tokens", message: "No tokens found"}];
        }

        return this.sendMulti({
            title: message.title,
            body: message.body,
            tokens,
            data: message.data,
        });
    }

    /**
     * Send a notification to a A when B likes A.
     *
     * This method is invoked by the user-B likes user-A, and send messages to all devices of A.
     *
     * @param {UserLikeEvent} event - The event triggered when a user likes another user.
     *
     * @return {Promise<Array<{ [key: string]: unknown }>>} Array of results. This is same result of 'sendMulti'.
     */
    static async sendMessageWhenUserLikeMe(event: UserLikeEvent): Promise<Array<{ [key: string]: unknown }>> {
        console.log("sendMessageWhenUserLikeMe: event:", event);
        // const user = await UserService.get(event.senderUid);
        const displayName = await UserService.getDisplayName(event.senderUid);

        // 메시지를 받는 사람의 언어 코드를 가져와 메세지 받는 사람의 언어로 메시지를 보낸다.
        const langaugeCode = await UserSettingService.getLanguageCode(event.receiverUid);
        console.log("sendMessageWhenUserLikeMe: displayName:", displayName, ", langaugeCode:", langaugeCode);
        const title = T.likeFcmTitle(langaugeCode, displayName);
        const body = T.likeFcmBody(langaugeCode, displayName);
        const data = {
            uids: [event.receiverUid],
            title,
            body,
            data: {
                receiverUid: event.receiverUid,
                senderUid: event.senderUid,
            },
        };
        dog("sendMessageWhenUserLikeMe: calling sendNotificationToUids(data):", data);
        return await this.sendNotificationToUids(data);
    }
}


