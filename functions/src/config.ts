

/**
 * Config
 *
 * 기본적으로 설정을 하는 클래스
 */
export class Config {
    // debug = true 이면, 함수에 로그를 남긴다.
    static debug = true;

    // Cloud Functions Server Region
    static region = "asia-northeast3";

    // Firebase Realtime Database Region
    static rtdbRegion = "asia-southeast1";

    static typesenseCollection = "silversSearch";
    // testing
    // static typesenseCollection = "testSearch";

    // User paths
    static users = "users";
    static whoLikeMe = "who-like-me";
    static whoILike = "who-i-like";

    // Path to save tokens
    // 테스트를 할 때에는 "user-fcm-tokens-test" 경로를 사용한다.
    static userFcmTokens = "user-fcm-tokens";
    static pushNotificationLogs = "push-notification-logs";

    // 푸시 알림 기록을 기록할 것인지 여부.
    // 이 값을 true 로 하면, 푸시 알림을 한 후, 그 결과를 DB 에 기록한다. 로그를 기록하면 DB 용량이 커 질 수 있으므로 주의해야 한다.
    // 개발 및 테스트 할 때에는 이 값을 true 로 해서, 확인을 해 볼 필요가 있다.
    static logPushNotificationLogs = true;

    // user settings
    static userSettings = "user-settings";


    // Forum paths
    static posts = "posts";
    static postSummaries = "post-summaries";
    static postAllSummaries = "post-all-summaries";
    static postSubscriptions = "post-subscriptions";

    static comments = "comments";

    /**
     * Returns the path of the chat room
     * @param {string} roomId chat room id
     * @return {string} path of the chat room
     */
    static chatRoomPath(roomId: string): string {
        return `chat-rooms/${roomId}`;
    }

    /**
     * Returns the path of the chat room setting
     *
     * @param {string} roomId chat room id
     * @return {string}
     */
    static chatRoomSettingPath(roomId: string): string {
        return `settings/chat-rooms/${roomId}`;
    }


    // Command paths
    static commands = "commands";

    /**
     * debug 가 true 일 때만 로그를 남긴다.
     * @param {string} message message to log
     * @param {any} optionalParams optional parameters to log
     */
    static log(message: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...optionalParams: any[]) {
        if (Config.debug) {
            console.log(message, ...optionalParams);
        }
    }


    // removeBadTokens 값은 더 이상 사용되지 않는다.
    // 실제로 토큰이 올바르지만 네트워크 또는 서버 문제, 소스 코딩 문제로 푸시 알림 전송시 에러가 발생할 수 있다.
    // 그래서, 올바른 토큰이 삭제되는 경우가 발생하기 때문이다. 이를 해결하기 위해서는 공식 문서에서 권장하는 방법을 사용해야 한다.
    //
    // 푸시 알림을 보낼 때, 잘못된 토큰이 있으면 삭제를 할 것인지 여부.
    // 주의 할 점은 올바른 토큰임에도 불구하고 Network 에러나 기타 설정, 서버 등의 에러로 인해서 푸시 알림 전송시 에러(잘못된 토큰)로 인식될 수 있다.
    // 그래서, 가능한 이 값을 false 로 하여, 푸시 알림을 할 때 잘못된 토큰을 삭제하지 않을 것을 권장한다. 잘못된 토큰을 DB 에 계속 남겨 두고, 반복적으로 푸시 알림 에러가 떠도 큰 문제가 없다.
    // 이 값이 true 로 지정되면, 잘못된 토큰을 삭제한다.
    //
    static removeBadTokens = false;


    // 푸시 알림을 보낼 때, dry run 을 할 것인지 여부.
    // dry run 을 true 로 하면, 실제로 메시지가 전달되지 않는다. 즉, 테스트 할 때에만 true 로 한다.
    static messagingDryRun = false;


    // 푸시 알림을 보낼 때, 한번의 batch 작업에서 보낼 수 있는 최대 토큰 수.
    // 예를 들어 총 토큰의 수가 101 개 이고, 이 값이 100 이면, 100 개의 토큰을 한번에 보내고, 나머지 1개의 토큰을 다시 보낸다. 즉, 두번 batch 작업을 한다.
    static fcmMaxConcurrentConnections = 100;
}
