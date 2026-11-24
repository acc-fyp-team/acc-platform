import Constants from 'expo-constants';

/**
 * ONE place for the API address. Never hard-code URLs in screens.
 *
 * API_PORT  -> the port the .NET API runs on (ask Hamid; placeholder for now).
 * API_HOST  -> leave null to auto-use the laptop running `npx expo start`
 *              (works for a physical phone on the same Wi-Fi).
 *              Android emulator: set '10.0.2.2'.
 *              Or set the laptop LAN IP by hand, e.g. '192.168.1.5'.
 * USE_MOCK  -> true = fake login responses, no server needed.
 *              Set false once the real API is reachable.
 */
export const API_PORT = 5112; // Backend http profile (launchSettings.json)
export const API_HOST: string | null = null;
export const USE_MOCK = true;

function detectHost(): string {
  // hostUri looks like "192.168.1.5:8081" (the laptop running Metro)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return hostUri.split(':')[0];
  return '10.0.2.2';
}

export const API_BASE_URL = `http://${API_HOST ?? detectHost()}:${API_PORT}`;

/** Request timeout in ms. */
export const REQUEST_TIMEOUT_MS = 15000;
