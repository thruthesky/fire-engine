import { expect } from "chai";
import { ChatService } from "../../src/chat/chat.service";

import { describe, it } from "mocha";

import { initializeFirebaseOnce } from "../initialize-firebase-once";

initializeFirebaseOnce();



describe('Chat Password Test', () => {
    it('Check password - error test with empty passwrod', async () => {
        const re = await ChatService.checkPassword('room-id', '');
        expect(re).to.be.false;
    });
    it('Check password - error test', async () => {
        const re = await ChatService.checkPassword('room-id', 'password1');
        expect(re).to.be.false;
    });
    it('Check password - set password but error test', async () => {
        await ChatService.setPassword('room-id', 'password2');
        const re = await ChatService.checkPassword('room-id', 'wrong-password');
        expect(re).to.be.false;
    });
    it('Check password - success test', async () => {
        await ChatService.setPassword('room-id', 'password2');
        const re = await ChatService.checkPassword('room-id', 'password2');
        expect(re).to.be.true;
    });

});

