import * as functions from "firebase-functions";
import { isCreate, isDelete, isUpdate } from "../library";
import { getDatabase } from "firebase-admin/database";

export const eventTest = functions.database.ref('/etc/{id}')
    .onWrite(async (
        change: functions.Change<functions.database.DataSnapshot>,
        context: functions.EventContext<{
            id: string;
        }>
    ) => {
        if (isCreate(change)) {
            await getDatabase().ref('etc').child(context.params.id).update({ event: 'create' });
        } else if (isUpdate(change)) {
            await getDatabase().ref('etc').child(context.params.id).update({ event: 'update' });
        } else if (isDelete(change)) {
            await getDatabase().ref('etc').child(context.params.id).update({ event: 'delete' });
        } else {
            await getDatabase().ref('etc').child(context.params.id).update({ event: 'none' });
        }
    });