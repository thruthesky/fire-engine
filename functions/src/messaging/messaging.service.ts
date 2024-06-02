import * as admin from "firebase-admin";
import axios, { AxiosError } from "axios";
import { SendMultiMessages, SendOneMessage } from "./messaging.interfaces";
import { Config } from "../config";
import { chunkArray, getProjectID } from "../library";

/**
 * Messaging service class
 */
export class MessagingService {

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
     * @return {Promise<Array<{ [key: string]: string }>>} Array of results
     * - 결과는 배열로 리턴된다.
     * - 단, 주의할 것은 입력값 확인을 해서 에러가 있으면, 토큰의 수와 상관없이 첫번째 배열 항목에만 에러 정보를 넣어서 리턴한다.
     * - 토큰을 전송 할 때, access token 을 가져오지 못하면 마찬가지로 첫번째 배열 항목에 에러 정보를 넣어서 리턴한다.
     */
    static async sendMulti(message: SendMultiMessages): Promise<Array<{ [key: string]: string }>> {



        // ---- 입력 값 체크 ---

        if (!message.tokens) {
            return [{ code: "messaging/missing-tokens", message: "tokens is required" }];
        }
        // 토큰인 문자열로 들어오면, 배열로 변환한다.
        if (typeof message.tokens === 'string') {
            message.tokens = (message.tokens as string).split(",");
        }
        if (message.tokens.length === 0) {
            return [{ code: "messaging/missing-tokens", message: "tokens is required" }];
        }
        if (!message.title) {
            return [{ code: "messaging/missing-title", message: "title is required" }];
        }
        if (!message.body) {
            return [{ code: "messaging/missing-body", message: "body is required" }];
        }




        // Firebase Admin SDK 에서 short-lived OAuth2 access token 을 가져온다. Bearer 토큰으로 사용한다.
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
            return [{ code: 'messaging/failed-to-get-access-token', message: "Failed to get access token" }];
        }


        // Chunk the array of tokens. The maximum number of tokens in a chunk is 200.
        // 최대 200개 단위로 토큰을 나눈다.
        const _size = message.maxConcurrent ?? Config.fcmMaxConcurrentConnections;
        const chunkSize = _size > 200 ? 200 : _size;
        const chunks: string[][] = chunkArray(message.tokens, chunkSize);

        const results: Array<{ [key: string]: string }> = [];

        // Promise.allSettled() 를 통해서 토큰을 chunkSize 만큼 나누어서 병렬로 전송한다.
        for (const chunk of chunks) {
            console.log('chunkSize:', chunkSize, ', no of tokens in chunk:', chunk.length, ', chunk:', chunk);
            const promises = chunk.map(token => this.sendOne({
                token,
                title: message.title,
                body: message.body,
                accessToken,
                shortErrorMessage: message.shortErrorMessage,
            }));
            const re = await Promise.allSettled(promises);

            results.push(...re.map((r) => {
                return r.status === 'fulfilled' ? r.value : r.reason;
            }));
        }
        return results;
    }


    private static async sendOne(message: SendOneMessage): Promise<{ [key: string]: any }> {
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
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken,
                },
            });
            console.log('sendOne: re:', re.data);
            return { code: '', token: message.token, message: '' };
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
}
