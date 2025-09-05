import { HttpContextToken } from '@angular/common/http';


/** Skip the 401 logout flow for this request.
 *  Use on calls that must NOT trigger the interceptor's logout logic
 */
export const SKIP_LOGOUT = new HttpContextToken<boolean>(() => false);

/** Skip the loading interceptor/overlay
 */
export const SKIP_LOADING_INTCR = new HttpContextToken<boolean>(() => false);


/** Marks requests as a *silent* auth check:
 *  no toast and no console error if /me returns 401 (user not logged in).
 */
export const SILENT_AUTH_CHECK = new HttpContextToken<boolean>(() => false);


