

import {ChatService} from "./chat.service";
import {dog} from "../library";
import {onCall} from "firebase-functions/v2/https";


import {MessagingService} from "../messaging/messaging.service";

import {ChatCreateEvent} from "./chat.interface";
import {onValueCreated} from "firebase-functions/v2/database";


/**
 * Check password
 *
 * 참고로, data 는 클라이언트로 부터 전달되는 데이터이며, context 는 클라이언트의 인증 정보를 담고 있다.
 * 즉, data 는 클라이언트가 전달하는 그대로의 값을 가지고 있다. 클라이언트가 boolean 전달하면,
 * data 는 그 자체로 boolean 값이 되고, number 를 전달하면, number 가 되고, object 를 전달하면
 * object 가 된다.
 *
 */
export const chatJoinWithPassword = onCall(async (request) => {
    dog("chatJoinWithPassword() begins with;", request.data);
    const re = await ChatService.joinWithPassword(request.data.roomId, request.data.password, request?.auth?.uid ?? "");
    dog("result;", re);
    return re;
});


// export const chatJoinWithPasswordGen1 = functions.https.onCall(async (data, context) => {
//     dog("chatJoinWithPassword() begins with;", data);
//     const re = await ChatService.joinWithPassword(data.roomId, data.password, context?.auth?.uid ?? "");
//     dog("result;", re);
//     return re;
// });


/**
 * 새로운 채팅 메시지가 작성되면(전송되면) 해당 채팅방 사용자에게 메시지를 전송한다.
 *
 */
export const sendMessagesToChatRoomSubscribers = onValueCreated(
    "/chat-messages/{room}/{id}",
    async (event) => {
    // Grab the current value of what was written to the Realtime Database.
        const data: ChatCreateEvent = {
            ...event.data.val(),
            id: event.params.id,
            roomId: event.params.room,
        };

        await MessagingService.sendMessagesToChatRoomSubscribers(data);
    });
