import { MsgKey } from './message-keys';

export const MESSAGES_DE: Record<MsgKey, string> = {
    'auth.sessionExpired': 'Session expired. Please log in again.',
    'auth.refreshFailed': 'Unable to refresh session. Please log in again.',
    'auth.invalidCredentials': 'Username or password is incorrect.',
    'auth.accountNotActivated': 'Your account is not active yet. Please verify your email address.',
    'auth.resetEmailSent': 'If an account exists, a reset email has been sent.',
    'auth.resetInvalidLink': 'Invalid or expired reset link.',
    'auth.resetFailed': 'Password reset failed. The link may have expired.',
    'auth.resetSuccess': 'Your password has been changed. Please sign in.',
    'network.offline': 'Network error. Please check your connection.',
    'http.badRequest': 'Please check your input.',
    'http.unexpected': 'Unexpected error. Please try again later.',
    'player.quality.1080': 'Streaming in 1080p based on your connection and screen-height.',
    'player.quality.720': 'Streaming in 720p based on your connection and screen-height.',
    'player.quality.480': 'Streaming in 480p based on your connection and screen-height.',
    'player.quality.fallback': 'Streaming quality selected by your screen.',
    'player.error.source': 'Could not load the video stream. Please try again.',
}