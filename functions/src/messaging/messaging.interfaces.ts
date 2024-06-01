

/**
 * Interface for the message to be sent
 * 
 * @title: Title of the message
 * @body: Body of the message
 * @tokens: Array of tokens to send the message to
 * @data: Additional data to be sent
 */
export interface SendMessage {
    title: string;
    body: string;
    tokens: string[];
    data?: any;
}