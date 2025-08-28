export const environment = {
    production: false,
    recaptchaEnabled: false,
    recaptchaSiteKey: '',
    apiBaseUrl: 'API_BASE_URL',
    API_PREFIXES: [
        '/api',                        // Dev-Proxy / Reverse-Proxy
        'http://localhost:8000',      // Direct dev backend
        'https://api.example.com',    // TODO: replace with your prod API
    ]
};