import { MsgKey } from './message-keys';

export const MESSAGES_DE: Record<MsgKey, string> = {
    'auth.sessionExpired': 'Sitzung abgelaufen. Bitte erneut anmelden.',
    'auth.refreshFailed': 'Sitzung konnte nicht erneuert werden. Bitte erneut anmelden.',
    'auth.invalidCredentials': 'Benutzername oder Passwort ist falsch.',
    'auth.accountNotActivated': 'Dein Konto ist noch nicht aktiviert. Bitte bestätige deine E-Mail-Adresse.',
    'auth.resetEmailSent': 'Falls ein Konto existiert, wurde eine E-Mail zum Zurücksetzen gesendet.',
    'auth.resetInvalidLink': 'Ungültiger oder abgelaufener Zurücksetzungslink.',
    'auth.resetFailed': 'Zurücksetzen des Passworts fehlgeschlagen. Der Link könnte abgelaufen sein.',
    'auth.resetSuccess': 'Dein Passwort wurde geändert. Bitte melde dich an.',
    'network.offline': 'Netzwerkfehler. Bitte überprüfe deine Verbindung.',
    'http.badRequest': 'Bitte überprüfe deine Eingaben.',
    'http.unexpected': 'Unerwarteter Fehler. Bitte versuche es später erneut.',
    'player.quality.1080': 'Streaming in 1080p basierend auf deiner Verbindung und Bildschirmhöhe.',
    'player.quality.720': 'Streaming in 720p basierend auf deiner Verbindung und Bildschirmhöhe.',
    'player.quality.480': 'Streaming in 480p basierend auf deiner Verbindung und Bildschirmhöhe.',
    'player.quality.fallback': 'Streaming-Qualität wurde anhand deines Bildschirms gewählt.',
    'player.error.source': 'Der Videostream konnte nicht geladen werden. Bitte versuche es erneut.',
    'signup.success': 'Die Registrierung war erfolgreich.',
}