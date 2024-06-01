# Fireflutter Extension


This extension simplifies the installation and management of Firebase Cloud Functions required by FireFlutter.


## Installation

1. Install the latest version of FireFlutter Extensions

2. Give `firebase.admin` role to the service account of the FireFlutter Extension Instance. This is a temporary workaround until there would be a solution of `IAM_PERMISSION_DENIED of cloudmessaging.messages.create`.


## API of FireFlutter Extensions

### sendPushNotifications

You can get the endpoint of the API from your Firebase console.



## Knwon issues


### IAM_PERMISSION_DENIED


- FireFlutter extension uses HTTP v1 API for sending FCM. There is a permission error of `cloudmessaging.messages.create` while sending push notifications. This looks like a bug since it's not working as it is stated in their documents at [How to assign roles to an extension](https://firebase.google.com/docs/extensions/publishers/access#how-to-assign-roles) and [Firebsse products](https://firebase.google.com/docs/extensions/publishers/access#supported-roles-firebase).
    - To resolve this error, simply add `firebase.admin` on the service account of the extensions.



