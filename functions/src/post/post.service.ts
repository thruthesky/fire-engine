import {getDatabase} from "firebase-admin/database";
import {Post, PostCreateBackgroundEvent, PostSummary, PostSummaryAll} from "./post.interface";
import {Config} from "../config";

/**
 * Post service class
 */
export class PostService {
    /**
     * Returns a post from the database under '/posts/category/postId'.
     *
     *
     * @param {string} category 카테고리
     * @param {stirng} postId 글 아이디
     * @return {Promise<Post>} 글 내용
     */
    static async get(category: string, postId: string): Promise<Post> {
        const db = getDatabase();
        const data = (await db.ref(`${Config.posts}/${category}/${postId}`).get()).val();
        return data as Post;
    }


    /**
     * 글 필드 내용을 가져와 리턴한다.
     *
     * @param {string} category 카테고리
     * @param {string} postId 글 아이디
     * @param {string} field 필드
     * @return {Promise<any>} 필드의 내용을 리턴한다.
     *
     * @example 예제는 tests/forum/PostService.getField.spec.ts 를 참고한다.
     */
    static async getField(category: string, postId: string, field: string): Promise<any> { // eslint-disable-line
        const db = getDatabase();
        const data = (await db.ref(`${Config.posts}/${category}/${postId}/${field}`).get()).val();
        return data;
    }

    /**
     * Sets the summary of the post in `post-summaries` and `post-all-summary`
     *
     * @param {PostCreateBackgroundEvent} post post data from the event
     * @param {string} category category of the post
     * @param {string} id id of the post
     * @return {Promise<void>} the promise of the operation
     */
    static async setSummary(post: PostCreateBackgroundEvent, category: string, id: string,): Promise<void> {
        if (post.uid === undefined) throw new Error("uid is required");
        if (post.createdAt === undefined) throw new Error("createdAt is required");
        if (post.order === undefined) throw new Error("order is required");
        const summary = {
            uid: post.uid,
            createdAt: post.createdAt,
            order: -post.createdAt,
            title: post.title ?? null,
            content: post.content ?? null,
            url: post.urls?.[0] ?? null,
            deleted: post.deleted ?? null,
        } as PostSummary;

        const db = getDatabase();
        await db.ref(`${Config.postSummaries}/${category}/${id}`).update(summary);
        const summaryAll: PostSummaryAll = {
            ...summary,
            category,
        };
        await db.ref(`${Config.postAllSummaries}/${id}`).update(summaryAll);
        return;
    }


    /**
     * deletes the summary of the post in `post-summaries` and `post-all-summary`
     *
     * @param {string} category category of the post
     * @param {stirng} postId post id
     */
    static async deleteSummary(category: string, postId: string) {
        const db = getDatabase();
        await db.ref(`${Config.postSummaries}/${category}/${postId}`).remove();
        await db.ref(`${Config.postAllSummaries}/${postId}`).remove();
    }
}


