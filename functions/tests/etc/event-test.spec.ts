import "mocha";
import * as test from "firebase-functions-test";
import { getDatabase } from "firebase-admin/database";

// 여기서 initializeFirebaseOnce() 함수를 한번만 호출하여 Firebase 앱을 여러번 초기화 하지 않도록 한다.
import { initializeFirebaseOnce } from "../initialize-firebase-once";

// 이벤트 테스트를 위한 클라우드 함수를 가져온다. 로직을 별도의 함수로 만드는 이유는 Firebase 접속 초기화를
// src/index.ts 에서 하고, test 에서 하는 중복 초화 등을 막기 위해서이다.
import { testEvent } from "../../src/etc/etc.functions";


initializeFirebaseOnce();


const id = 'node-id';

describe('Create/Update/Delete 이벤트 테스트', () => {

    it('Create 테스트', async () => {
        // 테스트를 위한 클라우드 함수를 wrap() 함수로 감싼다.
        const wrapped = test().wrap(testEvent);

        // before 와 after 의 snapshot 을 아래와 같이 makeDocumentSnapshot() 함수로 만든다.
        const dataSnap = test().database.makeDataSnapshot({
            what: 'to create',
        }, 'etc/' + id);
        const nullSnap = test().database.makeDataSnapshot(null, 'etc/' + id);

        // 실제 클라우드 함수를 호출한다.
        // 아래의 데이터는 임시 데이터이다. 실제 원격에 있는 클라우드 함수 코드를 실행하는 것이 아니라,
        // 현재 소스 코드의 클라우드 함수를 실행하여 테스트 하는 것이다.
        // 데이터를 생성하므로, beforeSnap 은 null 이고, afterSnap 은 실제 데이터가 들어간다.
        await wrapped(
            test().makeChange(nullSnap, dataSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: {
                    uid: 'temp-uid-jack',
                },
                authType: 'USER', // only for realtime database functions
                params: { id },
            });


        // 클라우드 함수 호출이 끝났으면, 실제 원격 DB 가 업데이트 되었을 것이므로, DB 에서 값을 가져와
        // 데이터가 잘 변경되었는지 확인한다.
        const snapshot = await getDatabase().ref(`etc/${id}`).get();
        if (snapshot.val().what !== 'to create') {
            throw new Error('Invalid what value');
        }

        if (snapshot.val().event !== 'create') {
            throw new Error('Invalid response');
        }
    });

    it('Update 테스트', async () => {
        // 테스트를 위한 클라우드 함수를 wrap() 함수로 감싼다.
        const wrapped = test().wrap(testEvent);

        // before 와 after 의 snapshot 을 아래와 같이 makeDocumentSnapshot() 함수로 만든다.
        const beforeSnap = test().database.makeDataSnapshot({
            what: 'alredy created',
        }, 'etc/' + id);
        const afterSnap = test().database.makeDataSnapshot({
            what: 'to update',
        }, 'etc/' + id);


        // 실제 클라우드 함수를 호출한다.
        // 아래의 데이터는 임시 데이터이다. 실제 원격에 있는 클라우드 함수 코드를 실행하는 것이 아니라,
        // 현재 소스 코드의 클라우드 함수를 실행하여 테스트 하는 것이다.
        // 데이터를 수정하므로, beforeSnap 은 이전 데이터가 들어가고, afterSnap 은 수정된 데이터가 들어간다.
        await wrapped(
            test().makeChange(beforeSnap, afterSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: {
                    uid: 'temp-uid-jack',
                },
                authType: 'USER', // only for realtime database functions
                params: { id },
            });


        // 클라우드 함수 호출이 끝났으면, 실제 원격 DB 가 업데이트 되었을 것이므로, DB 에서 값을 가져와
        // 데이터가 잘 변경되었는지 확인한다.
        const snapshot = await getDatabase().ref(`etc/${id}`).get();
        if (snapshot.val().what !== 'to update') {
            throw new Error('Invalid what value');
        }

        if (snapshot.val().event !== 'update') {
            throw new Error('Invalid response');
        }
    });

    it('Delete 테스트', async () => {
        // 테스트를 위한 클라우드 함수를 wrap() 함수로 감싼다.
        const wrapped = test().wrap(testEvent);

        // before 와 after 의 snapshot 을 아래와 같이 makeDocumentSnapshot() 함수로 만든다.
        const beforeSnap = test().database.makeDataSnapshot({
            what: 'alredy updated',
        }, 'etc/' + id);
        const afterNullSnap = test().database.makeDataSnapshot(null, 'etc/' + id);


        // 실제 클라우드 함수를 호출한다.
        // 아래의 데이터는 임시 데이터이다. 실제 원격에 있는 클라우드 함수 코드를 실행하는 것이 아니라,
        // 현재 소스 코드의 클라우드 함수를 실행하여 테스트 하는 것이다.
        // 데이터를 삭제하므로, beforeSnap 은 이전 데이터가 들어가고, afterSnap 은 null 이다.
        await wrapped(
            test().makeChange(beforeSnap, afterNullSnap),
            {
                eventId: 'temp-event-id',
                timestamp: new Date().getTime().toString(),
                auth: {
                    uid: 'temp-uid-jack',
                },
                authType: 'USER', // only for realtime database functions
                params: { id },
            });


        // 클라우드 함수 호출이 끝났으면, 실제 원격 DB 가 업데이트 되었을 것이므로, DB 에서 값을 가져와
        // 데이터가 잘 변경되었는지 확인한다.
        const snapshot = await getDatabase().ref(`etc/${id}`).get();
        if (snapshot.val() !== null) {
            throw new Error('Error: not deleted');
        }

    });

});
