import * as admin from "firebase-admin";


/**
 * Get the value of the path from realtime database
 *
 * @param {string} path path of the database node to get the data
 * @return {T}
 * - The value of the path
 * - `null` if the path does not exist
 *
 * @see `realtime-database.spec.ts` for the test and detailed usage
 */
export async function databaseGet<T>(path: string): Promise<T> {
    const snapshot = await admin.database().ref(path).get();
    return snapshot.val() as T;
}


/**
 * Set the value of the path from realtime database
 *
 * @param {string} path path of the database node to set the data
 * @param {T} value value to set
 * @return {Promise<void>} the promise of the operation
 */
export async function databaseSet<T>(path: string, value: T): Promise<void> {
    await admin.database().ref(path).set(value);
    return;
}
