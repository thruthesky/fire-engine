import "mocha";
import * as test from "firebase-functions-test";
import { getDatabase } from "firebase-admin/database";

import { initializeFirebaseOnce } from "../initialize-firebase-once";
import { postSummaries } from "../../src/post/post.functions";

import { Config } from "../../src/config";

initializeFirebaseOnce();



describe('Create/Update/Delete 이벤트 테스트', () => {

    const uid = 'temp-uid-jack';
    const createdAt = new Date().getTime();
    const postId = 'temp-post-id-' + new Date().getTime();
    const category = 'temp-category';
    const path = Config.posts + '/' + category + '/' + postId;

    it('글 생성 테스트', async () => {
        // 테스트 함수
        const wrapped = test().wrap(postSummaries);

        // before 와 after 의 snapshot 을 아래와 같이 makeDocumentSnapshot() 함수로 만든다.
        const data = {
            uid,
            createdAt,
            order: -createdAt,
            title: 'title',
            content: 'content',
            urls: ['url'],
        };
        const createSnap = test().database.makeDataSnapshot(data, path);
        const nullSnap = test().database.makeDataSnapshot(null, path);

        await wrapped(
            test().makeChange(nullSnap, createSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: { uid },
                authType: 'USER', // only for realtime database functions
                params: { category, postId },
            });


        // 클라우드 함수 호출이 끝났으면, 실제 원격 DB 가 업데이트 되었을 것이므로, DB 에서 값을 가져와
        // 데이터가 잘 변경되었는지 확인한다.
        const snapshot = await getDatabase().ref(Config.postSummaries).child(category).child(postId).get();
        if (snapshot.val().title !== data.title) {
            throw new Error('summary fialed. wrong title.');
        }
        const snapshotAll = await getDatabase().ref(Config.postAllSummaries).child(postId).get();
        if (snapshotAll.val().title !== data.title) {
            throw new Error('All summary fialed. wrong title.');
        }
    });
    it('Update 테스트', async () => {
        const wrapped = test().wrap(postSummaries);

        const beforeSnap = test().database.makeDataSnapshot({}, path);

        const data = {
            uid,
            createdAt,
            order: -createdAt,
            title: 'title updated',
            content: 'content',
            urls: ['url'],
        };
        const afterSnap = test().database.makeDataSnapshot(data, path);

        await wrapped(
            test().makeChange(beforeSnap, afterSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: { uid },
                authType: 'USER',
                params: { category, postId },
            });

        const snapshot = await getDatabase().ref(Config.postSummaries).child(category).child(postId).get();
        if (snapshot.val().title !== data.title) {
            throw new Error('summary fialed. wrong title.');
        }

        const snapshotAll = await getDatabase().ref(Config.postAllSummaries).child(postId).get();
        if (snapshotAll.val().title !== data.title) {
            throw new Error('All summary fialed. wrong title.');
        }
    });




    it('글 Delete 테스트', async () => {

        const wrapped = test().wrap(postSummaries);


        const data = {
            uid,
            createdAt,
            order: -createdAt,
            title: 'title updated',
            content: 'content',
            urls: ['url'],
        };
        const dataSnap = test().database.makeDataSnapshot(data, path);

        const nullSnap = test().database.makeDataSnapshot(null, path);

        await wrapped(
            test().makeChange(dataSnap, nullSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: { uid },
                authType: 'USER',
                params: { category, postId },
            });

        const snapshot = await getDatabase().ref(Config.postSummaries).child(category).child(postId).get();
        if (snapshot.exists() !== false) {
            throw new Error('Summary fialed. Post sumamry exists.');
        }

        const snapshotAll = await getDatabase().ref(Config.postAllSummaries).child(postId).get();
        if (snapshotAll.exists() !== false) {
            throw new Error('All summary fialed. Post sumamry exists.');
        }
    });
});
