/**
 * @fileoverview Firebase Cloud Functions for post.
 */
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";
// import { getDatabase } from "firebase-admin/database";
// import * as functions from "firebase-functions";
import {Config} from "../config";
import {isCreate, isDelete, isUpdate, strcut} from "../library";
import {PostService} from "./post.service";


import {DataSnapshot, DatabaseEvent, onValueCreated, onValueWritten} from "firebase-functions/v2/database";

import {PostCreateEvent} from "./post.interface";
import {PostCreateMessage} from "../messaging/messaging.interfaces";
import {MessagingService} from "../messaging/messaging.service";
import {Change} from "firebase-functions/v1";


/**
 * Post write 이벤트가 발생하면, 해당 포스트의 요약 정보를 업데이트 한다.
 */
export const postSummaries = onValueWritten(
    `${Config.posts}/{category}/{postId}`,
    async (event: DatabaseEvent<Change<DataSnapshot>>) => {
        if (isCreate(event.data) || isUpdate(event.data)) {
            await PostService.setSummary(event.data.after.val(), event.params.category, event.params.postId);
        } else if (isDelete(event.data)) {
            await PostService.deleteSummary(event.params.category, event.params.postId);
        }
    },
);

// export const postSummaries = functions.database.ref(`${Config.posts}/{category}/{postId}`)
//     .onWrite(async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext<{
//         category: string;
//         postId: string;
//     }>) => {
//         if (isCreate(change) || isUpdate(change)) {
//             await PostService.setSummary(change.after.val(), context.params.category, context.params.postId);
//         } else if (isDelete(change)) {
//             await PostService.deleteSummary(context.params.category, context.params.postId);
//         }
//     });


/**
 * 게시판(카테고리) 구독자들에게 메시지 전송
 *
 * 새 글이 작성되면 메시지를 전송한다.
 */
export const sendMessagesToCategorySubscribers = onValueCreated(
    `${Config.posts}/{category}/{id}`,
    async (event) => {
        // Grab the current value of what was written to the Realtime Database.
        const data = event.data.val() as PostCreateEvent;

        const post: PostCreateMessage = {
            id: event.params.id,
            category: event.params.category,
            title: strcut(data.title ?? "", 64),
            body: strcut(data.content ?? "", 100),
            uid: data.uid,
            image: data.urls?.[0] ?? "",
        };

        return await MessagingService.sendMessagesToCategorySubscribers(post);
    });


