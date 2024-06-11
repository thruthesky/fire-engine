import {getDatabase} from "firebase-admin/database";
import {Config} from "../config";
import {databaseGet} from "../realtime-database";
import {UserSetting} from "./user-setting.interfaces";


/**
 * UserService
 */
export class UserSettingService {
  /**
     * Get the user setting data from RTDB under /user-settings from the give uid.
     *
     * @param {string} uid uid of the user
     * @return {Promise<UserSetting>} the promise of the user data
     */
  static async get(uid: string): Promise<UserSetting> {
    const db = getDatabase();
    const data = (await db.ref(`${Config.userSettings}/${uid}`).get()).val();
    return data as UserSetting;
  }

  /**
     * Get the languageCode of the user from user settings.
     *
     * @param {string} uid uid of the user
     * @return {Promise<string>} the promise of the languageCode
     */
  static async getLanguageCode(uid: string): Promise<string> {
    return await databaseGet(`${Config.userSettings}/${uid}/languageCode`);
  }
}
