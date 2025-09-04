# Streamflex Frontend (Angular 19)

Single-Page-App für den kleinen Netflix-Clone.  
Ziele: moderne Angular-Patterns (**Signals**, optional **Zoneless**), sauberes Dev-Setup (Proxy), klare Prod-Builds.

![Angular](https://img.shields.io/badge/angular-19-red)
![Build](https://img.shields.io/badge/build-ready-brightgreen)

---

## Table of Contents
- [Voraussetzungen](#voraussetzungen)
- [Umgebungen / Environment](#umgebungen--environment)
- [Dev-Start (mit Proxy)](#dev-start-mit-proxy)
- [CSRF & Auth (JWT + Cookies)](#csrf--auth-jwt--cookies)

---

## Voraussetzungen
- Node.js 
- npm
- Angular CLI (`npm i -g @angular/cli`)

---

## Umgebungen / Environment



`src/environments/environment.template.ts` 

DEV:
In Dev gehen Requests relativ über /api und werden vom Angular-Proxy an das Backend (z. B. http://localhost:8000) weitergereicht.

```ts
export const environment = {
  production: false,
  recaptchaEnabled: false,
  recaptchaSiteKey: 'YOUR SITE KEY',
  // Für Dev lassen wir die API via Proxy laufen (siehe proxy.conf & start.sh):
  apiBaseUrl: '/api',
};
```

PROD:

In Prod direkt auf die öffentliche API zeigen.

```ts
export const environment = {
  production: true,
  recaptchaEnabled: true,
  recaptchaSiteKey: 'YOUR SITE KEY',
  apiBaseUrl: 'https://api.streamflex.tobias-ruhmanseder.de/api',
};
```

## Dev-Start

`proxy.conf.json (Beispiel)`
```ts
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Start:
```ts
source start.sh
```

Wichtig: In Dev muss environment.apiBaseUrl = "/api" sein, damit die Requests den Proxy benutzen. In Prod ist es die absolute API-URL.


## CSRF & Auth (JWT + Cookies)

Das Backend arbeitet mit HttpOnly Cookies für Access/Refresh + CSRF.

### FRONTEND-SEITE:
   - alle API-Requests, die Cookies mitschicken, benötigen `withCredentials: true`

### DEV (Proxy):
  - durch den Proxy (/api -> http://localhost:8000) verhält es sich wie same-origin → CORS ist simpel.

### PROD:
  - environment.apiBaseUrl auf die echte API-Domain setzen
  - Cookies/CSRF-Domain im Backend korrekt konfigurieren







