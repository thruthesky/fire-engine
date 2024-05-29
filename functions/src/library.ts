
import * as functions from "firebase-functions";


/**
 * Returns true if the event is a create event
 *
 * @param changefunctions.Change<functions.database.DataSnapshot>
 * @returns boolean
 */
export function isCreate(change: functions.Change<functions.database.DataSnapshot>): boolean {
    return !change.before.exists() && change.after.exists();
}


/**
 * Returns true if the event is an update event
 *
 * @param changefunctions.Change<functions.database.DataSnapshot>
 * @returns boolean
 */
export function isUpdate(change: functions.Change<functions.database.DataSnapshot>): boolean {
    return change.before.exists() && change.after.exists();
}

/**
 * Return true if the event is a delete event
 *
 * @param changefunctions.Change<functions.database.DataSnapshot>
 * @returns boolean
 */
export function isDelete(change: functions.Change<functions.database.DataSnapshot>): boolean {
    return change.before.exists() && !change.after.exists();
}
