import * as admin from "firebase-admin";
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



/**
 * Returns chunks of the array
 *
 * 
 * @return {number}
 * 
 * see `chunkArray.spec.ts` for the test
 * 
 */
export function chunkArray(myArray: any[], chunk_size: number): any[][] {
    const results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    return results;
}

/**
 * This function retrieves the project ID from the Firebase admin app options.
 * 
 * @returns {string} The project ID. If the project ID is not set in the app options, 
 * it tries to retrieve it from the credential options. If it's not there either, it returns an empty string.
 */
export function getProjectID(): string {
    const app = admin.app();
    // Return the project ID from the app options, or from the credential options if it's not set in the app options
    // If it's not set in either, return an empty string
    return app.options.projectId ||
        (app.options.credential && (app.options.credential as unknown as { projectId: string }).projectId) || '';
}
