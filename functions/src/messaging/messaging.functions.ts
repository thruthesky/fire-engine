
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios, {AxiosError} from "axios";

/**
 * 토큰을 입력받아서 메시지를 전송한다.
 */
export const sendPushNotifications = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
        // Firebase Admin SDK 에서 short-lived OAuth2 access token 을 가져온다. Bearer 토큰으로 사용한다.
        const accessToken = await admin.app().options.credential?.getAccessToken();

        // 입력 값 가져오기
        const tokens = req.body?.tokens ?? req.query.tokens;
        const title = req.body?.title ?? req.query.title;
        const body = req.body?.body ?? req.query.body;

        // 입력 값 체크
        if (!tokens) {
            res.status(400).send({code: "fireflutter-messaging/missing-tokens", message: "tokens is required"});
            return;
        }
        if (!title) {
            res.status(400).send({code: "fireflutter-messaging/missing-title", message: "title is required"});
            return;
        }
        if (!body) {
            res.status(400).send({code: "fireflutter-messaging/missing-body", message: "body is required"});
            return;
        }

        const tokenArray = tokens.split(",");

        // test token: dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT
        const token = tokenArray[0];

        console.log("token, title, body", token, title, body);

        try {
            const re = await axios.post("https://fcm.googleapis.com/v1/projects/withcenter-test-3/messages:send", {
                "message": {
                    token,
                    notification: {
                        title,
                        body,
                    },
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken?.access_token,
                },
            });
            console.log("re: ", re);
            res.send({code: 200});
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                console.log("data; ", data);
                res.status(400).send({code: "fireflutter-messaging/send-error", message: "axios.post failed with", error: data.error});
            } else {
                console.error(e);
            }
        }
    });
