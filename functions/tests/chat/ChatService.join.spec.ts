import { expect } from "chai";
import { ChatService } from "../../src/chat/chat.service";

import { describe, it } from "mocha";

import { initializeFirebaseOnce } from "../initialize-firebase-once";

initializeFirebaseOnce();



describe('Chat Join Test', () => {
    it('Chat join - success test', async () => {
        await ChatService.join('room-id', 'my-uid');
        const room = await ChatService.getRoom('room-id');
        expect(room.users['my-uid']).to.be.true;
    });
    it('Chat join - error - wrong room id', async () => {
        await ChatService.join('room-id-3', 'my-uid');
        const room = await ChatService.getRoom('room-id');
        expect(room.users['my-uid-3']).to.be.undefined;
    });
    it('Chat join - error - wrong password', async () => {
        await ChatService.join('room-id-3', 'my-uid');
        const room = await ChatService.getRoom('room-id-3');
        expect(room.users['my-uid-3']).to.be.undefined;
    });
});

