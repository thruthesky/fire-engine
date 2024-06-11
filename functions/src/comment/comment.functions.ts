
import {onValueCreated} from "firebase-functions/v2/database";
import { } from "../messaging/messaging.interfaces";
import {MessagingService} from "../messaging/messaging.service";
import {CommentCreateEvent, CommentCreateMessage} from "./comment.interfaces";
import {strcut} from "../library";


/**
 * 새 코멘트가 작성되면 푸시 알림(메시지)를 전송한다.
 *
 * @return {Promise<string>} 푸시 알림 전송 후, 그 기록으로 생성된 키를 리턴한다. 이 키는 테스트 할 때 사용 할 수 있다.
 */
export const sendMessagesToCommentSubscribers = onValueCreated(
    "/comments/{postId}/{commentId}",
    async (event) => {
        // Grab the current value of what was written to the Realtime Database.
        const data = event.data.val() as CommentCreateEvent;

        const comment: CommentCreateMessage = {
            id: event.params.commentId,
            category: data.category ?? "",
            postId: event.params.postId,
            parentId: data.parentId ?? "",
            title: "New comment ...",
            body: strcut(data.content ?? "", 100),
            uid: data.uid ?? "",
            image: data.urls?.[0] ?? "",
        };

        console.log("sendMessagesToCommentSubscribers: ", comment);
        return await MessagingService.sendMessagesToNewCommentSubscribers(comment);
    });

