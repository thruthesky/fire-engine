
import * as admin from "firebase-admin";
import { Config } from "../config";
import { ERROR_CHAT_ROOM_SETTING_NOT_EXIST, ERROR_EMPTY_CHAT_PASSWORD, ERROR_EMPTY_ROOM_ID, ERROR_WORNG_CHAT_PASSWORD, SUCCESS } from "../definitions";

/**
 * ChatService
 */
export class ChatService {
    /**
     * Returns true if the input password is correct.
     * @param {string} roomId chat room id
     * @param {string} password chat room password
     * @return {boolean}
     * - false if the password is incorrect
     * - false if the password is not set in the database
     */
    static async checkPassword(roomId: string, password: string): Promise<boolean> {
        // if the password is empty, return false
        if (!password) {
            return false;
        }
        // get password
        const snapshot = await admin.database().ref(`settings/chat/${roomId}/password`).get();
        if (!snapshot.exists()) {
            return false;
        }
        const correctPassword = snapshot.val();

        // if the password is empty on the database, return false
        if (!correctPassword) {
            return false;
        }

        // if the password is incorrect, return false
        if (correctPassword !== password) {
            return false;
        }

        return true;
    }

    /**
     * Let the user join the chat room
     * 
     * Even if the user is already joined, this function does not throw an error.
     * 
     * @param {string} roomId chat room id
     * @param {string} uid uid of the user to be joined
     */
    static async join(roomId: string, uid: string) {
        await admin.database().ref(`${Config.chatRoomPath(roomId)}/users/${uid}`).set(true);
    }

    /**
     * Returns the chat room data
     * @param roomId chat room id
     * @returns {{[key:string]: any}}
     */
    static async getRoom(roomId: string): Promise<{ [key: string]: any }> {
        const snapshot = await admin.database().ref(Config.chatRoomPath(roomId)).get();
        return snapshot.val();
    }


    /**
     * Sets the password of the chat room
     * @param {string} roomId chat room id
     * @param {string} password password
     */
    static async setPassword(roomId: string, password: string): Promise<void> {
        await admin.database().ref(`settings/chat/${roomId}/password`).set(password);
    }

    /**
     * Let the user join the chat room with the password.
     * 
     * @param roomId chat room id
     * @param password chat room password to join
     * @param uid the user's uid to be joined
     * @returns {{code: string }}
     */
    static async joinWithPassword(roomId: string, password: string, uid: string): Promise<{ code: string }> {

        if (!roomId) {
            return { code: ERROR_EMPTY_CHAT_PASSWORD };
        }
        if (!password) {
            return { code: ERROR_EMPTY_ROOM_ID };
        }

        // get chat room password
        const snapshot = await admin.database().ref(`settings/chat/${roomId}/password`).get();
        if (!snapshot.exists()) {
            return { code: ERROR_CHAT_ROOM_SETTING_NOT_EXIST };
        }

        const re = await ChatService.checkPassword(roomId, password);
        if (re == false) {
            return { code: ERROR_WORNG_CHAT_PASSWORD };
        }

        await ChatService.join(roomId, uid);
        return { code: SUCCESS };
    }
}

