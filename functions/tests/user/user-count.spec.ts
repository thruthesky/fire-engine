import { expect } from "chai";
import "mocha";
import * as admin from "firebase-admin";
import { initializeFirebaseOnce } from "../initialize-firebase-once";

initializeFirebaseOnce();

describe("Count no of users", () => {
    it("Should be bigger than 0", async () => {
        const rtdb = admin.database();
        const snapshot = await rtdb.ref("users").get();
        console.log("snapshot.numChildren()", snapshot.numChildren());
        return expect(snapshot.numChildren()).greaterThan(0);
    });
});
