
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { DataSnapshot, DatabaseEvent, onValueWritten } from "firebase-functions/v2/database";


import { convertData, dog, isCreate, isDelete, isUpdate } from "../library";
import { Config } from "../config";
// import { Config } from "./config";
// import { convertData, dog, isCreate, isDelete, isUpdate } from "./libraries";



export const mirrorDatabaseToFirestore =
    Config.mirrorPaths.map((path) => {
        return onValueWritten(
            {
                ref: path.source,
                region: Config.region,
            },
            async (event: DatabaseEvent<functions.Change<DataSnapshot>>) => {
                const change = event.data;
                const params = event.params;

                dog("Begin with params: ", params);
                console.log("Path properties; source=>", path.source, "destination=>", path.destination, "fields=>", path.fields);
                dog("change.before: key: ", change.before.key, ", value: ", change.before.val());
                dog("change.after: key: ", change.after.key, ", value: ", change.after.val());

                const db = admin.firestore();
                const ref = db.collection(path.destination).doc(change.after.key as string);

                // created or updated
                if (isCreate(change) || isUpdate(change)) {
                    // `collection` is added by 2024. 06. 13. It is actually the detination of the config and it is usually the name of the collection in the firestore. (add this to document)
                    const data = { ...convertData(path, change.after.val()), ...params, ...{ collection: path.destination } };
                    dog("Data to write at path: ", ref.path, ", data: ", data);
                    await ref.set(data);
                } else if (isDelete(change)) {
                    // deleted
                    dog("-- Delete;");
                    await ref.delete();
                }
            });
    });


