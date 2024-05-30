// import { expect } from "chai";
import "mocha";
import * as admin from "firebase-admin";
import { initializeFirebaseOnce } from "../initialize-firebase-once";
import axios from 'axios';

initializeFirebaseOnce();

describe("Get access token and send a push notification", () => {
    it("Should get a token and send a message", async () => {
        const accessToken = await admin.app().options.credential?.getAccessToken();
        try {
            const res = await axios.post('https://fcm.googleapis.com/v1/projects/withcenter-test-3/messages:send', {
                "message": {
                    "token": "dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT",
                    "notification": {
                        "title": "Message from Unit Test " + new Date().toISOString(),
                        "body": "This is an FCM Message"
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken?.access_token,
                }
            });
            console.log(res);
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
});
