
import * as functions from 'firebase-functions';
import { ChatService } from './chat.service';

/**
 * Check password
 * 
 * 참고로, data 는 클라이언트로 부터 전달되는 데이터이며, context 는 클라이언트의 인증 정보를 담고 있다.
 * 즉, data 는 클라이언트가 전달하는 그대로의 값을 가지고 있다. 클라이언트가 boolean 전달하면,
 * data 는 그 자체로 boolean 값이 되고, number 를 전달하면, number 가 되고, object 를 전달하면
 * object 가 된다.
 */
export const chatJoinWithPassword = functions.https.onCall(async (data, context) => {
    return ChatService.joinWithPassword(data.roomId, data.password, context?.auth?.uid ?? '');
});