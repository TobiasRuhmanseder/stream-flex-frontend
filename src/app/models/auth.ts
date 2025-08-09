import { User } from "./user.interfaces";

// models/auth.ts
export type SignInErrorCode =
    | 'invalid_credentials'
    | 'account_not_activated'
    | 'network'
    | 'unknown';

export type SignInResult =
    | { ok: true; user: User }
    | { ok: false; error: SignInErrorCode };