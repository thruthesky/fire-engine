
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from 'axios';
/**
 * 토큰을 입력받아서 메시지를 전송한다.
 */
export const sendPushNotifications = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
        const accessToken = await admin.app().options.credential?.getAccessToken();
        const tokens = req.body.tokens;
        const title = req.body.title;
        const body = req.body.body;

        // test token: dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT
        const token = tokens[0];

        try {
            const res = await axios.post('https://fcm.googleapis.com/v1/projects/withcenter-test-3/messages:send', {
                "message": {
                    token,
                    notification: {
                        title,
                        body
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
