# Fireflutter Extension


This extension simplifies the installation and management of Firebase Cloud Functions required by FireFlutter.


## Installation

1. Install the latest version of FireFlutter Extensions

2. Give `firebase.admin` role to the service account of the FireFlutter Extension Instance. This is a temporary workaround until there would be a solution of `IAM_PERMISSION_DENIED of cloudmessaging.messages.create`.


## 사용법

- Extensions 로 바꾼 이유는 설치가 쉬워서이다. 특히, FlutterFlow 와 같이 소스 코드를 전혀 모르고도 개발을 할 수 있도록 하는 툴들이 많은데, 도움이 될 것이라 생각한다.

- 클라우드 함수를 설치하는 것과 Extensions 으로 클라우드 함수를 설치하는 것에 대한 차이를 이해 할 필요가 있다.
  - Extensions 으로 설치하면,
    - 동일한 함수를 여러개 설치 할 수 있다.
    - 그리고 함수 앞에 `ext-[name]-` 이 붙는다. 예를 들어 extensions 이름이 fff 이고, 함수 이름이 abc 이면, `ext-fff-abc` 와 같이 된다. 그러나 이 형식은 extension 이 맨 처음 한번만 설치될 때 그렇고, 동일한 extensions 가 여러번 설치되면, `ext-[name]-[n]-` 와 같이 설치되는 함수 이름이 달라진다.
    - extensions 이 중복으로 설치될 때, Event trigger 형식의 함수라면 상관이 없지만, `callable` 함수나 `http rest api` 형식의 함수라면 호출하는 endpoint 가 달라져야 하므로  주의 한다.
      - 예를 들어 on call 함수의 경우, 소스 코드의 함수 이름은 `abc` 이지만, 호출 할 때에는 `ext-fff-abc` 와 같이 호출을 해야 한다. 이러한 것들이 클라우드 함수로 설치할 때와 다른 점인데, 알아 둘 필요가 있다.




## API of FireFlutter Extensions

### 푸시 전송 로직

- 푸시 전송은 내부적으로 `MessagingService.MessagingService.sendMulti` 함수를 통해서 메시지를 보낸다. 이 함수는 내 부적으로 `MessagingService.MessagingService.sendOne` 함수를 사용한다. 참고로, `sendOne` 함수는 private 이어서, 직접 이 함수를 호출 할 수는 없다.

- 푸시 전송은 여러개의 토큰을 전달 할 수 있는데, 메시지를 전송하는 루틴에서 `async/await` 을 쓴다. 이 때, 한번에 여러 메시지를 전송 할 수 있도록 병렬 처리를 지원하는데, `maxConcurrent=2` 와 같이 설정하면 `async/await Promise.allSettled()` 를 통해서 한번에 서 2개의 푸시 메시지를 동시에 보낼 수 있도록 해 준다. 기본 값은 `Config.ts` 에 100 개로 지정되어져 있다. 즉, maxConcurrent 옵션을 추가하지 않으면 기본적으로 100 단위로 푸시 알림을 보낸다. 이 값은 최대 200 까지 지원한다.

### sendPushNotifications

You can get the endpoint of the API from your Firebase console.







### 에러

메시지 전송을 할 때, 결과는 배열로 넘어 온다. 에러가 있어도 배열로 넘어 온다.

- 참고: E2E 테스트 파일인 `sendPushNotifications.spec.ts` 파일을 참고한다.



```json
[
  {
    code: 'messaging/send-one-error',
    message: 'axios.post failed with',
    token: 'a',
    error: {
      code: 400,
      message: 'The registration token is not a valid FCM registration token',
      status: 'INVALID_ARGUMENT'
    },
    details: {
      '@type': 'type.googleapis.com/google.firebase.fcm.v1.FcmError',
      errorCode: 'INVALID_ARGUMENT'
    }
  },
  {
    code: 'messaging/send-one-error',
    message: 'axios.post failed with',
    token: 'b',
    error: {
      code: 400,
      message: 'The registration token is not a valid FCM registration token',
      status: 'INVALID_ARGUMENT'
    },
    details: {
      '@type': 'type.googleapis.com/google.firebase.fcm.v1.FcmError',
      errorCode: 'INVALID_ARGUMENT'
    }
  },
  {
    code: 'messaging/send-one-error',
    message: 'axios.post failed with',
    token: 'c',
    error: {
      code: 400,
      message: 'The registration token is not a valid FCM registration token',
      status: 'INVALID_ARGUMENT'
    },
    details: {
      '@type': 'type.googleapis.com/google.firebase.fcm.v1.FcmError',
      errorCode: 'INVALID_ARGUMENT'
    }
  }
]
```


- 토큰에 문제가 있는 경우, code 는 `messaging/send-one-error` 이고, `error` 에는 에러 정보가 들어간다.  원래 `error.details` 에 배열로 에러 추가 정보가 들어가는데, 그 중 첫번 째 항목만, `details` 에 넣어서 리턴한 것이다.

- 토큰의 수가 많아 질 수록 리턴되는, shortErrorMessage=true 를 지정하면, 아래와 같이 에러 메시지가 짧게 들어온다. 특히, `status` 가 `erorr.status` 값이다.

```json
[
  {
    code: 'messaging/send-one-error',
    status: 'INVALID_ARGUMENT',
    token: 'a'
  },
  {
    code: 'messaging/send-one-error',
    status: 'INVALID_ARGUMENT',
    token: 'b'
  },
  {
    code: 'messaging/send-one-error',
    status: 'INVALID_ARGUMENT',
    token: 'c'
  }
]
```


## 좋아요

- 좋아요를 하는 경우, `tests/user/userLike.spec.ts` 를 보면 보다 자세히 어떻게 동작하는지 알 수 있다.
- 클라이언트가 `/who-i-like/<my-uid> {otherUid: true}` 를 저장하면 `src/user/user.functions.ts` 의 `userLike` background cloud event trigger 함수가 동작을 한다.
- 메시지를 보낸 사용자의 이름을 가져오고, 메시지를 받는 사용자의 언어를 가져와서, 메시지를 받는 사용자의 언어로 번역하여 메시지를 전송한다.





## On call functions

- 정확하기 작업을 하기 위해서, firebase event trigger 로 연결하면 안되고, on call 함수로 바로 접속해야 한다. 그렇지 않으면 코드가 꼬이게 된다.

- The Command is an interface to execute specific code that is restricted to run in Firebase Cloud Functions. For example, if an app admin wants to disable a user, the corresponding code to perform this action must be executed within Firebase Cloud Functions only.

- With this command interface., the client app can do things like delete, disable, enable user accounts and more.

- The command is working as cloud function event trigger. Meaning, the clinet app can simply create a data under `/commands/<login-user-uid>`.
    - The creation of the command data is secured by security rules. And the authentication validation is done with security rules.

- The instruction of the command is formed like below.

```json
{
    "command": "the command",
    "uid": "The uid of the user to be affected",
    "createdAt": "timestamp",
    "endedAt": "timestamp",
    "result": "success or failed"
}
```


### Disable user

- Admin can disable or enable a user. If the user is disabled, then the user can't sign in anymore, nor refresh their ID token. In the security rule, if a user is disabled, the user no longer owns the request.auth.uid (within an hour from the time that the user disabled). So, all the security rules would fails.
  - When a user is diabled, the `disabled` field will be set to true.

- The instruction of the command is formed like below.

```json
/commands/<admin-uid> {
    "command": "diable-user",
    "uid": "The uid of the user to be deleted",
    "createdAt": "timestamp",
    "endedAt": "timestamp",
    "result": "success"
}
```

### Enable user

- Enabling a user is similiar to Disabling user.


### Delete a user

- A user can delete himself.

```json
/commands/<login-user-uid> {
    "command": "delete-user",
    "uid": "login-user-uid",
    "createdAt": "timestamp",
    "endedAt": "timestamp",
    "result": "success"
}
```



## 비밀번호를 통해서 채팅방 입장

- 채팅방에 입장을 하려고 할 때, 채팅방 설정에 비밀번호가 있으면, security rules 에 의해서 client end 에서 join 을 못한다.
- `chatJoinWithPassword` 함수를 통해서 join 을 할 수 있다.
- 클라이언트에서 on call 함수를 호출 할 때, 함수명을 extensions name 을 뜻하는 `ext-fff-` 를 앞에 붙여서 `ext-fff-chatJoinWithPassword` 와 같이 해야 한다.
  - Firebase Extensions 은 동일한 extensions 을 여러번 설치할 수 있는데 설치할 때, instance id 가 달라진다. 즉, 두번 째, fireflutter extensions 을 설치하면, 함수 이름이 `ext-fff-chatJoinWithPassword` 아닌, 다른 함수 이름으로 된다. 따라서, 여러개의 fireflutter exstensions 를 설치해도 맨 처음 설치한 `ext-fff-chatJoinWithPassword` 만 호출 될 수 있으므로 주의한다.
  


## Knwon issues


### IAM_PERMISSION_DENIED


- FireFlutter extension uses HTTP v1 API for sending FCM. There is a permission error of `cloudmessaging.messages.create` while sending push notifications. This looks like a bug since it's not working as it is stated in their documents at [How to assign roles to an extension](https://firebase.google.com/docs/extensions/publishers/access#how-to-assign-roles) and [Firebsse products](https://firebase.google.com/docs/extensions/publishers/access#supported-roles-firebase).
    - To resolve this error, simply add `firebase.admin` on the service account of the extensions.



