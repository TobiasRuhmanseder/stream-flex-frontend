import { MsgKey } from './message-keys';

export const MESSAGES_DE: Record<MsgKey, string> = {
    'auth.sessionExpired': 'Session expired. Please log in again.',
    'auth.refreshFailed': 'Unable to refresh session. Please log in again.',
    'auth.invalidCredentials': 'Username or password is incorrect.',
    'auth.accountNotActivated': 'Your account is not active yet. Please verify your email address.',
    'network.offline': 'Network error. Please check your connection.',
    'http.badRequest': 'Please check your input.',
    'http.unexpected': 'Unexpected error. Please try again later.',
};