

/**
 * Interface for the message to be sent
 * 
 * @title: Title of the message
 * @body: Body of the message
 * @tokens: Array of tokens to send the message to
 * @data: Additional data to be sent
 */
export interface SendMultiMessages {
    title: string;
    body: string;
    tokens: string | string[];
    data?: any;
    shortErrorMessage?: boolean;
    maxConcurrent?: number;
}
export interface SendOneMessage {
    title: string;
    body: string;
    token: string;
    data?: any;
    accessToken: string;
    shortErrorMessage?: boolean;
}