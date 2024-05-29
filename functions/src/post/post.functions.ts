/**
 * @fileoverview Firebase Cloud Functions for post.
 */
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";
// import { getDatabase } from "firebase-admin/database";
import * as functions from "firebase-functions";
import { Config } from "../config";
import { isCreate, isDelete, isUpdate } from "../library";
import { PostService } from "./post.service";


/**
 * Post write 이벤트가 발생하면, 해당 포스트의 요약 정보를 업데이트 한다.
 */
export const postSummaries = functions.database.ref(`${Config.posts}/{category}/{postId}`)
    .onWrite(async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext<{
        category: string;
        postId: string;
    }>) => {
        if (isCreate(change) || isUpdate(change)) {
            await PostService.setSummary(change.after.val(), context.params.category, context.params.postId);
        } else if (isDelete(change)) {
            await PostService.deleteSummary(context.params.category, context.params.postId);
        }
    });

