

import * as functions from "firebase-functions";
import {MessagingService} from "./messaging.service";

/**
 * 토큰을 입력받아서 메시지를 전송한다.
 *
 * 주의: 리턴 값은 배열이다.
 * 주의: 에러가 발생하면 배열에 에러 정보를 넣어 리턴한다. 즉, status code 400 또는 500 으로 리턴하지 않는다.
 *
        // test token: dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT
        const token = tokenArray[0];
 */
export const sendPushNotifications = functions.https.onRequest(
    async (req: functions.Request, res: functions.Response) => {
        // 입력 값 가져오기
        const tokens = req.body?.tokens ?? req.query.tokens;
        const title = req.body?.title ?? req.query.title;
        const body = req.body?.body ?? req.query.body;
        const shortErrorMessage = req.body?.shortErrorMessage ?? req.query.shortErrorMessage;
        const maxConcurrent = req.body?.maxConcurrent ?? req.query.maxConcurrent;


        const results = await MessagingService.sendMulti({
            tokens,
            title,
            body,
            shortErrorMessage: shortErrorMessage === "true" ? true : false,
            maxConcurrent: maxConcurrent ? parseInt(maxConcurrent) : undefined,
        });

        res.send(results);
    });
