

import axios from 'axios';
import { expect } from 'chai';
import { ChatService } from '../../src/chat/chat.service';


const url = "http://localhost:5001/whatsapp-clone-1b1b2/us-central1/api";
describe('Chat Password Test', () => {
    it('Check password - error test with empty passwrod', async () => {
        const res = await axios.get(url, {});
        expect(res.data.code).equal(40041);
    });

    it('Check password - with wrong password', async () => {
        const res = await axios.get(url + "?roomId=abc&password=wrong-password-1234", {});
        expect(res.data.code).equal(40042);
    });

    it('Check password - set password in db but check with wrong password', async () => {
        ChatService.setPassword('room-id-abc', 'password-abc');
        const res = await axios.get(url + "?roomId=room-id-abc&password=password2", {});
        expect(res.data.code).equal(40042);
    });

    it('Check password - set password in db & check with right password', async () => {
        ChatService.setPassword('room-id-def', 'password-def');
        const res = await axios.get(url + "?roomId=room-id-def&password=password-def", {});
        expect(res.data.code).equal(0);
    });
});