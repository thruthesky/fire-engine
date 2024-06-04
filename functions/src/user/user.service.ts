import {getDatabase} from "firebase-admin/database";
import {Config} from "../config";
import {DeleteAccountResponse, User, UserCreateWithPhoneNumber, UserCreateWithPhoneNumberResponse} from "./user.interfaces";
import {getAuth} from "firebase-admin/auth";
import {databaseGet} from "../realtime-database";


/**
 * UserService
 */
export class UserService {
    /**
     * Get user data from RTDB under /users from the give uid.
     *
     * @param {string} uid uid of the user
     * @return {Promise<User>} the promise of the user data
     */
    static async get(uid: string): Promise<User> {
        const db = getDatabase();
        const data = (await db.ref(`${Config.users}/${uid}`).get()).val();
        return data as User;
    }

    /**
     * Get the display name of the user from RTDB under /users from the give uid.
     *
     * @param {string} uid uid of the user
     * @return {Promise<string>} the promise of the display name
     */
    static async getDisplayName(uid: string): Promise<string> {
        return await databaseGet(`${Config.users}/${uid}/displayName`);
    }

    /**
     * Create an account from a phone number
     *
     * It creates an account with the phone number. It returns the uid and the custom token.
     * Use this method when you want to create an account with a phone number.
     *
     * @param {UserCreateWithPhoneNumber} params phone number
     * @return {UserCreateWithPhoneNumberResponse} the promise of the result
     */
    static async createAccountWithPhoneNumber(params: UserCreateWithPhoneNumber): Promise<UserCreateWithPhoneNumberResponse> {
        const auth = getAuth();
        try {
            const userRecord = await auth.createUser({phoneNumber: params.phoneNumber});
            const customToken = await auth.createCustomToken(userRecord.uid);
            return {uid: userRecord.uid, customToken};
        } catch (e) {
            if (e instanceof Error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((e as any).errorInfo.code) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return {code: (e as any).errorInfo.code, message: (e as any).errorInfo.message, phoneNumber: params.phoneNumber};
                }
                return {code: e.name, message: e.message};
            } else {
                return {code: "unknown", message: "unknown error"};
            }
        }
    }


    /**
     * Deletes the user account from Firebase Auth
     *
     * It only deletes the user account from Firebase Auth. Deletion of user data from
     * Firestore or Realtime Database must be done in clientend.
     *
     * @param {string} inputUid uid of the user
     *
     * @return {Promise<DeleteAccountResponse>} the promise of the result
     * - { code: "ok" } if the user account is deleted successfully
     * - { code: ...error code..., message: ...error message..., uid: uid } if the user account is not found
     */
    static async deleteAccount(inputUid?: string): Promise<DeleteAccountResponse> {
        if (!inputUid) {
            return {code: "no-uid", message: "Pass uid to delete an account.", uid: ""};
        }
        const uid = inputUid;
        // Delete user account
        const auth = getAuth();
        try {
            await auth.deleteUser(uid);
            return {code: "ok", uid: uid};


            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            if (e instanceof Error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((e as any).errorInfo.code) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return {code: (e as any).errorInfo.code, message: (e as any).errorInfo.message, uid: uid};
                }
                return {code: e.name, message: e.message, uid: uid};
            } else {
                return {code: "unknown", message: `${e}`, uid: uid};
            }
        }
    }


    /**
     * Returns an array of user uids who have turned on the comment notification.
     *
     * 입력된 사용자 uid 들 중에서 코멘트 알림을 켜 놓은 사용자 uid 를 리턴한다. 새 코멘트 푸시 알림을 보낼 때 사용된다.
     *
     * @param {string[]} uids user uids
     *
     * @return {Promise<string[]>} an array of user uids who have turned on the comment notification.
     *
     * 참고로, Promise.all 을 사용하여 병렬로 처리하면, 더 빠르게 처리할 수 있다. 그러나 이 함수는 코멘트 알림을 보낼 때에만 사용되므로,
     * 많은 async/await 작업을 하지 않는다. 평균 4~5 개 정도로 예상된다. 그래서 병렬로 처리할 필요가 없다.
     *
     * @example 예제는 tests/user/UserService.filterUidsWithCommentNotification.spec.ts 를 참고한다.
     */
    static async filterUidsWithCommentNotification(uids: string[]): Promise<string[]> {
        const db = getDatabase();
        const filteredUids = [];
        for (const uid of uids) {
            const data = (await db.ref(`${Config.userSettings}/${uid}/commentNotification`).get()).val();
            if (data === true) {
                filteredUids.push(uid);
            }
        }
        return filteredUids;
    }


    /**
     * Returns all the tokens of multiples users in uids.
     *
     * This method gets the token list under '/user-fcm-tokens/{uid}' for each user and returns them in an array.
     *
     * @param {Array<string>} uids uids of users
     *
     * @return {Promise<Array<string>>} - Array of tokens.
     */
    static async getTokens(uids: Array<string>): Promise<Array<string>> {
        const promises = [];

        if (uids.length == 0) return [];

        const db = getDatabase();

        // uid 사용자 별 모든 토큰을 가져온다.
        for (const uid of uids) {
            promises.push(db.ref(Config.userFcmTokens).orderByChild("uid").equalTo(uid).get());
        }
        const settled = await Promise.allSettled(promises);


        // 토큰을 배열에 담는다.
        const tokens: Array<string> = [];
        for (const res of settled) {
            if (res.status == "fulfilled") {
                res.value.forEach((token) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    tokens.push(token.key!);
                });
            }
        }

        return tokens;
    }
}
