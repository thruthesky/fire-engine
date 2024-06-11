
import {AndroidConfig, ApnsConfig, FcmOptions, WebpushConfig} from "firebase-admin/messaging";


/**
 * Basic interface for sending a message
 *
 * Note that, the image is optional and is not the required field for sending a message
 */
export interface MessageNotification {
    title: string;
    body: string;
    image?: string;
}

/**
 *
 */
export interface MessageRequest extends MessageNotification {
    tokens: Array<string>;
    data?: { [key: string]: string };
}


/**
 * A message data interface for sending push notification when a new post is created.
 */
export interface PostCreateMessage {
    // 글 아이디
    id: string;
    // 카테고리
    category: string;
    title: string;
    body: string;
    // 글 쓴이 uid
    uid: string;
    image: string;
}


/**
 * Interface for push notification payload.
 */
export interface MessagePayload {
    notification: MessageNotification;
    data: {
        [key: string]: string;
    };
    token: string;
    success?: boolean;
    code?: string;

    android?: AndroidConfig;
    webpush?: WebpushConfig;
    apns?: ApnsConfig;
    fcmOptions?: FcmOptions;
}


/**
 * Inteface for sendNotificationToUids
 *
 * @uids: Array of uids to send the message to
 * @title: Title of the message
 * @body: Body of the message
 * @data: Additional data to be sent
 */
export interface NotificationToUids {
    uids: Array<string>;
    chunkSize?: number;
    title: string;
    body: string;
    image?: string;
    data?: { [key: string]: string };

    // 푸시 알림을 전송하는 목적.
    // - 로그를 기록할 때 사용한다.
    // 이 값에는 'post', 'comment', 'like', 'chat', 'profile' 등 어떤 액션에 대한 알림인지를 지정한다.
    // 'post' 는 새 글 작성 알림, 'comment' 는 새 코멘트 작성 알림, 'like' 는 좋아요 알림, 'chat' 은 채팅 알림,
    action: string;
    // 알림을 받는 대상의 객체 ID 이다.
    // action 이 'post' 이면 글 ID, 'comment' 이면 comment ID, 'like' 이면 like 를 받는 상대방의 ID, 'chat' 이면 채팅방 ID, 'profile' 이면 프로필 사용자 ID 이다.
    targetId: string;
}


/**
 * Interface for sending message when a user likes another user
 */
export interface UserLikeEvent {
    senderUid: string;
    receiverUid: string;
}


// export interface UserLikeEventForNotification {
//     uid: string;
//     otherUid: string;
// }
