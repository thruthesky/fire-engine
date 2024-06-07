import { expect } from "chai";
import * as test from 'firebase-functions-test';
// import { ChatService } from "../../src/chat/chat.service";
import { ERROR_CHAT_ROOM_SETTING_NOT_EXIST, ERROR_WORNG_CHAT_PASSWORD, SUCCESS } from "../../src/definitions";
import { initializeFirebaseOnce } from "../initialize-firebase-once";


import { chatJoinWithPassword } from "../../src/chat/chat.functions";
import { ChatService } from "../../src/chat/chat.service";

initializeFirebaseOnce();

describe('Chat Join Test', () => {
    it('Chat join - error test with wrong password', async () => {
        const wrapped = test().wrap(chatJoinWithPassword);

        const re = await wrapped({
            roomId: 'room-id-50',
            password: 'password-5',
        }, {
            auth: {
                uid: 'my-uid-5'
            }
        });

        expect(re.code).equal(ERROR_CHAT_ROOM_SETTING_NOT_EXIST);
    });
    it('Chat join - error test with wrong password', async () => {
        await ChatService.setPassword('room-id-4', 'password');
        const re = await ChatService.joinWithPassword('room-id-4', 'wrong-password', 'my-uid');
        expect(re.code).equal(ERROR_WORNG_CHAT_PASSWORD);
    });
    it('Chat join - success test with correct password', async () => {
        await ChatService.setPassword('room-id-4', 'password');
        const re = await ChatService.joinWithPassword('room-id-4', 'password', 'my-uid');
        expect(re.code).equal(SUCCESS);

        const room = await ChatService.getRoom('room-id-4');
        expect(room.users['my-uid']).to.be.true;
    });
});