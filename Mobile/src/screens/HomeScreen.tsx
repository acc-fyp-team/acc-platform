// Placeholder home after sign-in. Real MOB1 dashboard comes in a later story.
// Shows which modules this user can View, from GET /api/permissions/user/{id}.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/Button';
import { colors, fonts, radius, spacing, type } from '../theme';

export function HomeScreen() {
  const { user, permissions, signOut } = useAuth();
  const visible = permissions.filter((p) => p.action === 'View' && p.isAllowed).map((p) => p.module);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={type.h2}>Welcome, {user?.fullName}</Text>
        <Text style={[type.body, { color: colors.muted }]}>
          @{user?.username} · {user?.role}
        </Text>

        <View style={styles.card}>
          <Text style={type.label}>Modules you can open</Text>
          {visible.length === 0 ? (
            <Text style={type.body}>No modules assigned yet. Contact your admin.</Text>
          ) : (
            visible.map((m) => (
              <View key={m} style={styles.row}>
                <Text style={styles.rowText}>{m}</Text>
              </View>
            ))
          )}
        </View>

        <Button title="Sign out" variant="secondary" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
});
