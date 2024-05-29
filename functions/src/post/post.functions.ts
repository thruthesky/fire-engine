/**
 * @fileoverview Firebase Cloud Functions for post.
 */
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";
// import { getDatabase } from "firebase-admin/database";
import * as functions from "firebase-functions";
import {Config} from "../config";
import {isUpdate} from "../library";


/**
 * Post write 이벤트가 발생하면, 해당 포스트의 요약 정보를 업데이트 한다.
 */
export const postSummariesOnPostWrite = functions.database.ref(`${Config.posts}/{category}/{postId}`)
    .onWrite(async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext<{
        category: string;
        postId: string;
    }>) => {
        if (isUpdate(change)) {
            return;
        }
    });
