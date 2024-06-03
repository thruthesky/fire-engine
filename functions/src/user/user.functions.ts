import * as functions from "firebase-functions";
import { Config } from "../config";
import { dog, isCreate, isDelete, isUpdate } from "../library";

import { ServerValue, getDatabase } from "firebase-admin/database";
import { MessagingService } from "../messaging/messaging.service";


// phoneNumberRegister

// userLike

// userDeleteAccount => RTDB Event Trigger 로 하는데, Flutter 에서는 Completer 로 작성한다. 타임아웃 30초로 둔다.


/**
 * 좋아요 이벤트가 발생하면, 푸시 알림을 보낸다.
 */
export const userLike = functions.database.ref(`${Config.whoILike}/{myUid}/{targetUid}`)
  .onWrite(async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext<{
    myUid: string;
    targetUid: string;
  }>) => {
    dog("-- userLike begins; change.before:", change.before.val(), "change.after:", change.after.val());
    const db = getDatabase();
    const myUid = context.params.myUid;
    const targetUid = context.params.targetUid;

    dog("-- userLike path; myUid:", myUid, "targetUid:", targetUid);


    // created or updated
    if (isCreate(change) || isUpdate(change)) {
      dog("-- userLike; create or update;");
      await db.ref(`${Config.whoLikeMe}/${targetUid}`).update({ [myUid]: true });
      await db.ref(`users/${targetUid}`).update({ noOfLikes: ServerValue.increment(1) });
    } else if (isDelete(change)) {
      dog("-- userLike; delete;");
      // deleted
      await db.ref(`${Config.whoLikeMe}/${targetUid}/${myUid}`).remove();
      await db.ref(`users/${targetUid}`).update({ noOfLikes: ServerValue.increment(-1) });
    }


    // Send message to the target user
    if (isCreate(change)) {
      dog("-- userLike; send message;");
      const resultsOfUserLikeMessage = await MessagingService.sendMessageWhenUserLikeMe({
        receiverUid: targetUid,
        senderUid: myUid,
      });
      dog("-- userLike; resultsOfUserLikeMessage:", resultsOfUserLikeMessage);
    }
  });

