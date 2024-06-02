
import "mocha";
import * as admin from "firebase-admin";
import { databaseGet, databaseSet } from "../../src/realtime-database";
import { initializeFirebaseOnce } from "../initialize-firebase-once";
import { expect } from "chai";

initializeFirebaseOnce();


const rtdb = admin.database();

describe("Realtime Database tests", () => {
    before(async () => {
        // prepare the database
        await rtdb.ref('path/that/does/not/exist').set(null);
    });
    it("databaseGet - failure test", async () => {
        const v = await databaseGet('path/that/does/not/exist');
        expect(v).to.equal(null);
    });
    it("databaseGet - sucess test", async () => {
        const path = 'tmp/a/b/c';
        const ref = rtdb.ref(path);
        await ref.set('hello');
        const v = await databaseGet(path);
        expect(v).to.equal('hello');
    });
    it("databaseGet - sucess test", async () => {
        const path = 'tmp/a/b/c';
        const ref = rtdb.ref(path);
        await ref.set(false);
        const v = await databaseGet<boolean>(path);
        expect(v).to.equal(false);
    });

    it("database Set & Get - sucess test", async () => {
        const path = 'path/that/does/not/exist/for/set/test';
        await databaseSet(path, 'yo');
        const v = await databaseGet<boolean>(path);
        expect(v).to.equal('yo');
    });
});
