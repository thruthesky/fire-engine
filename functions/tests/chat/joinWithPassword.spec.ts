import { expect } from "chai";
import { ChatService } from "../../src/chat/chat.service";
import { ERROR_CHAT_ROOM_SETTING_NOT_EXIST, ERROR_WORNG_CHAT_PASSWORD } from "../../src/definitions";
import { initializeFirebaseOnce } from "../initialize-firebase-once";



initializeFirebaseOnce();

describe('Chat Join Test', () => {
    it('Chat join - error test with wrong password', async () => {
        const re = await ChatService.joinWithPassword('room-id-4', 'password', 'my-uid');
        expect(re.code).equal(ERROR_CHAT_ROOM_SETTING_NOT_EXIST);
    });
    it('Chat join - error test with wrong password', async () => {
        await ChatService.setPassword('room-id-4', 'password');
        const re = await ChatService.joinWithPassword('room-id-4', 'wrong-password', 'my-uid');
        expect(re.code).equal(ERROR_WORNG_CHAT_PASSWORD);
    });
});