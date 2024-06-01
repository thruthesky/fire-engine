
import * as functions from "firebase-functions";
// import { google } from "googleapis";


/**
 * Returns true if the event is a create event
 *
 * @param {functions.Change<functions.database.DataSnapshot>} change
 * @return {boolean}
 */
export function isCreate(change: functions.Change<functions.database.DataSnapshot>): boolean {
    return !change.before.exists() && change.after.exists();
}


/**
 * Returns true if the event is an update event
 *
 * @param {functions.Change<functions.database.DataSnapshot>} change
 * @return {boolean}
 */
export function isUpdate(change: functions.Change<functions.database.DataSnapshot>): boolean {
    return change.before.exists() && change.after.exists();
}

/**
 * Return true if the event is a delete event
 *
 * @param {functions.Change<functions.database.DataSnapshot>} change
 * @return {boolean}
 */
export function isDelete(change: functions.Change<functions.database.DataSnapshot>): boolean {
    return change.before.exists() && !change.after.exists();
}


// /**
//  * Get (retrieve) a short-lived OAuth 2.0 access token for seding FCM messages with HTTP v1 API.
//  *
//  * @returns {Promise<string>}
//  */
// function getGoogleApiOauthAccessToken() {
//     return new Promise(function (resolve, reject) {
//         const key = require('../placeholders/service-account.json');
//         const jwtClient = new google.auth.JWT(
//             key.client_email,
//             undefined,
//             key.private_key,
//             ['https://www.googleapis.com/auth/firebase.messaging'],
//             undefined
//         );
//         jwtClient.authorize(function (err, tokens) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(tokens!.access_token);
//         });
//     });
// }
