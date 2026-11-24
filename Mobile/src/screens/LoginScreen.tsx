// PID19 · Mobile Login (MS-01). Uses AA-01 / AA-02 contract.
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { USE_MOCK } from '../config/env';
import { colors, fonts, radius, spacing, type } from '../theme';

export function LoginScreen() {
  const { signIn, notice } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  async function onSubmit() {
    const fe: typeof fieldErrors = {};
    if (!username.trim()) fe.username = 'Username is required.';
    if (!password) fe.password = 'Password is required.';
    setFieldErrors(fe);
    setError(null);
    if (fe.username || fe.password) return;

    setLoading(true);
    try {
      await signIn(username, password, keepSignedIn);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.field === 'username' || e.field === 'password') {
          setFieldErrors({ [e.field]: e.message });
        } else {
          setError(e.message);
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>ACC</Text>
            </View>
            <Text style={type.h1}>Sign in</Text>
            <Text style={[type.body, { color: colors.muted }]}>
              Construction ERP for site and office
            </Text>
          </View>

          {!!notice && <Text style={styles.notice}>{notice}</Text>}

          <View style={styles.card}>
            <TextField
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              placeholder="Enter your username"
              error={fieldErrors.username}
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secure
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
              placeholder="Enter your password"
              error={fieldErrors.password}
            />

            <Pressable
              style={styles.checkRow}
              onPress={() => setKeepSignedIn((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: keepSignedIn }}
            >
              <View style={[styles.checkbox, keepSignedIn && styles.checkboxOn]}>
                {keepSignedIn && <Text style={styles.tick}>✓</Text>}
              </View>
              <Text style={type.body}>Keep me signed in</Text>
            </Pressable>

            {!!error && (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button title="Sign in" onPress={onSubmit} loading={loading} />
            <Button
              title="Forgot password?"
              variant="ghost"
              onPress={() => setError('Please contact your admin to reset your password.')}
            />
          </View>

          {USE_MOCK && (
            <Text style={styles.mockNote}>
              Mock mode: try demo / demo123, admin / admin123, inactive, locked
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  brand: { alignItems: 'center', gap: spacing.sm },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoText: { fontFamily: fonts.headingBold, fontSize: 20, color: colors.surface },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 32 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  tick: { color: colors.surface, fontSize: 13, fontFamily: fonts.bodySemi },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: radius.sm, padding: spacing.md },
  errorText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.error },
  notice: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.warning,
    backgroundColor: '#FFFBEB',
    padding: spacing.md,
    borderRadius: radius.sm,
    textAlign: 'center',
  },
  mockNote: { ...type.label, textAlign: 'center' },
});
