
import * as functions from 'firebase-functions';
import { ChatService } from './chat.service';

export const joinWithPassword = functions.https.onCall(async (data, context) => {
    return ChatService.joinWithPassword(data.roomId, data.password, context?.auth?.uid ?? '');
});