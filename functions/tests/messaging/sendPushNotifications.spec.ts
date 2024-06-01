import axios, { AxiosError } from "axios";
import "mocha";

// import { sendPushNotifications } from "../../src/messaging/messaging.functions";


// 여기서 initializeFirebaseOnce() 함수를 한번만 호출하여 Firebase 앱을 여러번 초기화 하지 않도록 한다.
// import { initializeFirebaseOnce } from "../initialize-firebase-once";
import { expect } from "chai";
// initializeFirebaseOnce();

const url = "http://127.0.0.1:5001/withcenter-test-3/us-central1/sendPushNotifications";

describe('sendPushNotifications', () => {

    it('Token undefined', async () => {
        try {
            await axios.get(url + '?title=t&body=b');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/missing-tokens');
            } else {
                console.error(e);
            }
        }
    });
    it('Title undefined', async () => {
        try {
            await axios.get(url + '?tokens=a,b,c&body=b');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/missing-title');
            } else {
                console.error(e);
            }
        }
    });
    it('Body undefined', async () => {
        try {
            await axios.get(url + '?tokens=a,b,c&title=t');
            expect.fail('Must be 500 error');
        } catch (e) {
            if (e instanceof AxiosError) {
                const data = e.response?.data;
                expect(data.code).to.equal('fireflutter-messaging/missing-body');
            } else {
                console.error(e);
            }
        }
    });
    it('send failure', async () => {
        try {
            await axios.get(url + '?tokens=a,b,c&title=t&body=b');
            expect.fail('Must be 500 error');
        } catch (e) {
            // Axios 에러 핸들링은 아래와 같이 한다.
            if (e instanceof AxiosError) {
                // 메시지 전송 실패의 경우, 아래와 같은 에러가 발생한다.
                //  {
                //    code: 'fireflutter-messaging/send-error',
                //    message: 'axios.post failed with',
                //    error: {
                //      code: 400,
                //      message: 'The registration token is not a valid FCM registration token',
                //      status: 'INVALID_ARGUMENT',
                //      details: [ [Object] ]
                //    }
                //  }
                const data = e.response?.data;
                // details 는 각 토큰별 전송 결과를 나타낸다.
                // 예: [ { '@type': 'type.googleapis.com/google.firebase.fcm.v1.FcmError', errorCode: 'INVALID_ARGUMENT'} ]
                // console.log('details', data.error.details);

                expect(data.code).to.equal('fireflutter-messaging/send-error');
            } else {
                console.error(e);
            }
        }
    });
    // 푸시 메시지 성공
    it('send success', async () => {
        try {
            await axios.get(url + '?tokens=dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT,b,c&title=t&body=b' + new Date().toISOString());
        } catch (e) {
            expect.fail('Must sucess');
        }
    });
});



