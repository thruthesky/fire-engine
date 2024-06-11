

/**
 * Comment Create for RTDB
 */
export interface CommentCreateEvent {
    uid?: string | null;
    parentId?: string | null;
    category?: string | null;
    content?: string | null;
    createdAt?: number | null;
    deleted?: boolean | null;
    urls?: Array<string> | null;
}


/**
 * CommentCreateEvent 에서 push notification 을 보내기 위한 데이터 타입이다.
 */
export interface CommentCreateMessage {
    // comment id.
    id: string;
    category: string;
    postId: string;
    parentId: string;
    title: string;
    body: string;
    uid: string;
    image: string;
}


/**
 * CommentCreateEvent 에서 push notification 을 보내기 위한 데이터 타입이다.
 */
export interface Comment {
    id?: string;
    postId: string;
    parentId?: string;
    category: string;
    content?: string;
    uid: string;
    urls?: string[];
    createdAt?: number | object;
    likes?: Array<string>;
    deleted?: boolean;
    order?: number;

}
