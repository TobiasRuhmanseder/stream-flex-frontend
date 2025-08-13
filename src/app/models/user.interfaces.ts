
/**
 * Data required to register a new user
 */
export interface SignUpRequest {
    email: string;
    password: string;
    recaptchaToken: string;
}
export interface SignUpResponse {
    email: string;
}

/**
 * Data required to authenticate an existing user
 */
export interface SignInRequest {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface SignInResponse {
    user: User;
}

/**
 * Represents a user's profile information returned from the server
 */
export interface User {
    id: number;
    email: string;
}

/**
 * Payload for checking if an email address is already in use
 */
export interface CheckEmailRequest {
    email: string;
    recaptchaToken: string;
}

/**
 * Response object indicating whether the email exists
 */
export interface CheckEmailResponse {
    exists: boolean;
}

export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  newPassword: string;
}


