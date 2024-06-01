import * as admin from "firebase-admin";
import { SendMessage } from "./messaging.interfaces";

/**
 * Messaging service class
 */
export class MessagingService {

    async getAccessToken(): Promise<string> {
        const accessToken = await admin.app().options.credential?.getAccessToken();
        if (!accessToken) {
            throw new Error("Failed to get access token");
        }
        return accessToken?.access_token;
    }
    /**
     * Send messages from tokens.
     */
    send(message: SendMessage) {


    }
}
