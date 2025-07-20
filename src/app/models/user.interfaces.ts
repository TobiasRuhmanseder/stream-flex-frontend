
/**
 * Data required to register a new user
 */
export interface SignUpData {
    email: string;
    password: string;
}

/**
 * Data required to authenticate an existing user
 */
export interface SignInData {
    email: string;
    password: string;
}

/**
 * Represents a user's profile information returned from the server
 */
export interface UserProfile {
    id: number;
    email: string;
}

/**
 * Payload for checking if an email address is already in use
 */
export interface CheckEmailDto {
    email: string;
    recaptchaToken: string;
}

/**
 * Response object indicating whether the email exists
 */
export interface CheckEmailResponse {
    exists: boolean;
}