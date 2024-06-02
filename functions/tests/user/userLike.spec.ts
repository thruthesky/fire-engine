import "mocha";
import * as test from "firebase-functions-test";
import { getDatabase } from "firebase-admin/database";

import { initializeFirebaseOnce } from "../initialize-firebase-once";
import { userLike } from "../../src/user/user.functions";


import { Config } from "../../src/config";
import { databaseSet } from "../../src/realtime-database";

initializeFirebaseOnce();


const token1 = 'dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT';

describe('User like test', () => {

    const myUid = 'A';
    const targetUid = 'B';
    const path = `${Config.whoILike}/${myUid}/${targetUid}`;




    // A 가 B 를 좋아요 할 때,
    it('A like B', async () => {

        // A 정보 준비
        await getDatabase().ref(`${Config.users}/${myUid}`).update({
            displayName: 'A',
        });

        // B 의 푸시 토큰 저장해서, 푸시 토큰이 전달되도록 한다.
        await getDatabase().ref(`${Config.userFcmTokens}/${token1}`).update({
            uid: targetUid,
        });

        // B 의 언어를 한국어로 설정하여 메시지가 한국어로 전달되게 테스트 한다.
        await databaseSet(`${Config.userSettings}/${targetUid}/languageCode`, 'ko');



        // 좋아요 수행, 클라우드 함수 호출
        const wrapped = test().wrap(userLike);
        const createSnap = test().database.makeDataSnapshot(true, path);
        const nullSnap = test().database.makeDataSnapshot(null, path);
        await wrapped(
            test().makeChange(nullSnap, createSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: { myUid },
                authType: 'USER', // only for realtime database functions
                params: { myUid, targetUid },
            }
        );


        // B 의 누가 나를 좋아요 했는지 정보 확인
        const snapshot2 = await getDatabase().ref(`${Config.whoLikeMe}`).get();
        console.log('All of who i like', snapshot2.val());

        const whoLikeMePath = `${Config.whoLikeMe}/${targetUid}/${myUid}`;
        const snapshot = await getDatabase().ref(whoLikeMePath).get();
        if (snapshot.val() !== true) {
            throw new Error('Value is not true');
        }

        // 푸시 알림이 전송 되었나?

    });
});
