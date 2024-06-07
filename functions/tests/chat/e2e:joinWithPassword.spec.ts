import { expect } from "chai";
import * as test from 'firebase-functions-test';
// import { ChatService } from "../../src/chat/chat.service";
import { ERROR_CHAT_ROOM_SETTING_NOT_EXIST } from "../../src/definitions";
import { initializeFirebaseOnce } from "../initialize-firebase-once";


import { joinWithPassword } from "../../src/chat/chat.functions";

initializeFirebaseOnce();

describe('Chat Join Test', () => {
    it('Chat join - error test with wrong password', async () => {
        const wrapped = test().wrap(joinWithPassword);

        const re = await wrapped({
            params: {
                roomId: 'room-id-50',
                password: 'password-5',
            }
        }, {
            auth: {
                uid: 'my-uid-5'
            }
        });

        console.log(re.code);

        expect(re.code).equal(ERROR_CHAT_ROOM_SETTING_NOT_EXIST);
    });
    // it('Chat join - error test with wrong password', async () => {
    //     await ChatService.setPassword('room-id-4', 'password');
    //     const re = await ChatService.joinWithPassword('room-id-4', 'wrong-password', 'my-uid');
    //     expect(re.code).equal(ERROR_WORNG_CHAT_PASSWORD);
    // });
});