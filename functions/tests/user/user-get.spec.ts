import "mocha";

// src/index.ts 를 가져오면 default Firebase app already exists 에러가 발생한다.
// 왜냐하면 src/index.ts 에서 다른 함수들을 export 하기도 하지만, 최상위 레벨에서 초기화를 하기 때문이다.
import { userUpdate } from "../../src/user.functions";

// 여기서 initializeFirebaseOnce() 함수를 한번만 호출하여 Firebase 앱을 여러번 초기화 하지 않도록 한다.
import { initializeFirebaseOnce } from "../initialize-firebase-once";
import { getDatabase } from "firebase-admin/database";
initializeFirebaseOnce();

describe('HTTP 함수 테스트', () => {

    it('사용자의 name 필드를 업데이트하는 테스트', async () => {
        // Cloud Function HTTP 함수(userUpdate) 에 전달할 파라메타 데이터 request 객체를 만든다.
        const req = {
            query: {
                uid: "uid-a",
                name: 'Name A: ' + new Date().getTime(),
            }
        };

        // Cloud Function HTTP 함수(userUpdate)는 두번째 파라메타의 객체에서 send() 함수를 호출하여 결과를
        // 클라이언트에게 리턴한다. 즉, 이 두번째 함수 객체의 send() 함수를 만들어서 전달한다.
        const res = {
            // 주의 할 것은 클라우드 함수에서 호출하는 response.send() 함수는
            // async 함수가 아니기 때문에, 여기서 async/await 방식으로 테스트를 할 수 없다.
            send: async (re: any) => {
                // 실제 클라우드 함수가 res.send() 함수를 호출하면, 여기서 결과를 받아서 확인한다.
                // 즉, 여기서 assert 를 하거나 throw 를 해도 된다.
                console.log('res.send() called', re);
                if (re.code !== 200) {
                    throw new Error('Invalid response');
                }
            }
        };

        // 실제 클라우드 함수 호출
        // 실제 클라우드 함수는 res.send() 함수를 호출하여 결과를 클라이언트에 전달하지만,
        // 그 값을 여기서 받을 수 없고, 위의 res { send: () {} } 에서 받으면 된다.
        await userUpdate(req as any, res as any);


        // 클라우드 함수 호출이 끝났으면, DB 가 업데이트 되었을 것이므로, DB 에서 값을 가져와
        // 데이터가 잘 변경되었는지 확인한다.
        const snapshot = await getDatabase().ref(`users/${req.query.uid}`).get();
        console.log('snapshot.val()', snapshot.val());
        if (snapshot.val().name !== req.query.name) {
            throw new Error('Invalid name');
        }
    });
});
