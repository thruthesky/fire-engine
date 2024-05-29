import * as functions from "firebase-functions";
import { isCreate, isDelete, isUpdate } from "../library";
import { getDatabase } from "firebase-admin/database";

export const testEvent = functions.database.ref("/etc/{id}")
  .onWrite(async (
    change: functions.Change<functions.database.DataSnapshot>,
    context: functions.EventContext<{
      id: string;
    }>
  ) => {
    if (isCreate(change)) {
      await getDatabase().ref("etc").child(context.params.id).update({
        event: "create",
        what: change.after.val().what
      });
    } else if (isUpdate(change)) {
      await getDatabase().ref("etc").child(context.params.id).update({
        event: "update",
        what: change.after.val().what

      });
    } else if (isDelete(change)) {
      await getDatabase().ref("etc").child(context.params.id).set(null);
    } else {
      await getDatabase().ref("etc").child(context.params.id).update({
        event: "none",
        what: null
      });
    }
  });
