import * as functions from "firebase-functions";
import { Config } from "../config";
import { isCreate, isDelete, isUpdate } from "../library";

import { ServerValue, getDatabase } from "firebase-admin/database";


// phoneNumberRegister

// userLike

// userDeleteAccount => RTDB Event Trigger 로 하는데, Flutter 에서는 Completer 로 작성한다. 타임아웃 30초로 둔다.


/**
 * Post write 이벤트가 발생하면, 해당 포스트의 요약 정보를 업데이트 한다.
 */
export const userLike = functions.database.ref(`${Config.whoILike}/{myUid}/{targetUid}`)
  .onWrite(async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext<{
    myUid: string;
    targetUid: string;
  }>) => {
    const db = getDatabase();
    const myUid = context.params.myUid;
    const targetUid = context.params.targetUid;

    // created or updated
    if (isCreate(change) || isUpdate(change)) {
      await db.ref(`${Config.whoLikeMe}/${targetUid}`).update({ [myUid]: true });
      await db.ref(`users/${targetUid}`).update({ noOfLikes: ServerValue.increment(1) });
    } else if (isDelete(change)) {
      // deleted
      await db.ref(`${Config.whoLikeMe}/${targetUid}/${myUid}`).remove();
      await db.ref(`users/${targetUid}`).update({ noOfLikes: ServerValue.increment(-1) });
    }

    /// TODO - 여기서 부터, 푸시 알림 전송하기
    // Send message to the target user
    // if (isCreate(event)) {
    //   await MessagingService.sendMessageWhenUserLikeMe({
    //     uid: targetUid,
    //     otherUid: myUid,
    //   });
    // }
  });

