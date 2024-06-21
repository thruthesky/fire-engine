/*
 * This template contains a HTTP function that responds
 * with a greeting when called
 *
 * Reference PARAMETERS in your functions code with:
 * `process.env.<parameter-name>`
 * Learn more about building extensions in the docs:
 * https://firebase.google.com/docs/extensions/publishers
 */

import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";
import { Config } from "./config";

admin.initializeApp();

setGlobalOptions({
    region: Config.region,
});


export * from "./chat/chat.functions";
export * from "./comment/comment.functions";
// export * from "./etc/etc.functions";
export * from "./messaging/messaging.functions";
export * from "./post/post.functions";
export * from "./user/user.functions";
export * from "./link/link.functions";
export * from "./mirror/mirror.functions";



