# Fireflutter Extension


This extension simplifies the installation and management of Firebase Cloud Functions required by FireFlutter.


## Installation

1. Install the latest version of FireFlutter Extensions

2. Give `firebase.admin` role to the service account of the FireFlutter Extension Instance. This is a temporary workaround until there would be a solution of `IAM_PERMISSION_DENIED of cloudmessaging.messages.create`.


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





## Knwon issues


### IAM_PERMISSION_DENIED


- FireFlutter extension uses HTTP v1 API for sending FCM. There is a permission error of `cloudmessaging.messages.create` while sending push notifications. This looks like a bug since it's not working as it is stated in their documents at [How to assign roles to an extension](https://firebase.google.com/docs/extensions/publishers/access#how-to-assign-roles) and [Firebsse products](https://firebase.google.com/docs/extensions/publishers/access#supported-roles-firebase).
    - To resolve this error, simply add `firebase.admin` on the service account of the extensions.



