/**
 * User interface
 */
export interface User {
    uid: string;
    displayName: string;
    photoUrl: string;
    isVerified: boolean;
    createdAt: number;
}


/**
 * Create user with phone number
 */
export interface UserCreateWithPhoneNumber {
    phoneNumber: string;
}

export interface UserCreateWithPhoneNumberResponse {
    code?: string,
    message?: string,
    uid?: string,
    customToken?: string,
    phoneNumber?: string
}


/**
 * Delete account response
 */
export interface DeleteAccountResponse {
    code: string;
    message?: string;
    uid: string;
}
