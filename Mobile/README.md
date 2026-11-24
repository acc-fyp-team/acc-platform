# ACC Platform — Mobile (React Native + Expo)

Part of the `acc-platform` monorepo. Stories: MS-01 (SCRUM-105 setup, mobile sign-in).

## Run

```bash
cd Mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone (same Wi-Fi as the laptop), or press `a` for the Android emulator.

## API address — one place only

Edit `src/config/env.ts`:

| Setting | Meaning |
|---|---|
| `API_PORT` | Port of the .NET API (`5112`, from Backend launchSettings.json http profile) |
| `API_HOST` | `null` = auto-use the laptop running Expo (physical phone). Emulator: `'10.0.2.2'` |
| `USE_MOCK` | `true` = fake responses, no server needed. Set `false` for the real API |

The API must listen on `0.0.0.0` over plain `http` for a phone to reach it, e.g.
`dotnet run --urls http://0.0.0.0:<port>`.

Quick check: open `http://<laptop-LAN-IP>:<port>/scalar/v1` in the phone browser.

## Mock logins (USE_MOCK = true)

| Username | Password | Result |
|---|---|---|
| demo | demo123 | Success (Manager, Salaries/Billing hidden) |
| admin | admin123 | Success (Admin) |
| inactive | any | 403 inactive account |
| locked | any | 429 too many attempts |
| other | any | 401 wrong username or password |

## Structure

```
src/
  config/env.ts        API base URL, port, mock switch
  theme/               Colours, fonts, spacing (ACC Figma design system)
  api/client.ts        fetch wrapper: Bearer token, { message, code, field } errors,
                       401 + "session_ended" -> sign out
  api/auth.ts          login, refresh, ping, permissions
  api/tokenStorage.ts  token in expo-secure-store
  api/mock.ts          fake responses
  auth/AuthContext.tsx session state, permission check can(module, action)
  components/          Button, TextField
  screens/             LoginScreen (PID19), HomeScreen (placeholder)
```

## Rules followed (from the AA-01 / AA-02 contract)

- Login by username; body `{ username, password, keepSignedIn }`.
- Screens are shown by permission (`module` + `View` + `isAllowed`), never by role name.
- Dates ISO 8601 UTC from the API, formatted on the client. Money is a plain number, Rs./Lac formatting on the client.
