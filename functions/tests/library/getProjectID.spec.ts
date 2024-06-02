import { expect } from "chai";
import "mocha";
import { getProjectID } from "../../src/library";


import { initializeFirebaseOnce } from "../initialize-firebase-once";

initializeFirebaseOnce();


describe("Get project ID - run after initializing the Emulator and the Firebase", () => {
    it("initialize", async () => {
        expect(getProjectID()).to.equal('withcenter-test-3');
    });
});






