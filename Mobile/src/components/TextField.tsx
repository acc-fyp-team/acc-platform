import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fonts, radius, spacing, touchHeight, type } from '../theme';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
  secure?: boolean;
}

export function TextField({ label, error, secure, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={type.label}>{label}</Text>
      <View
        style={[
          styles.box,
          focused && { borderColor: colors.brand },
          !!error && { borderColor: colors.error },
        ]}
      >
        <TextInput
          {...rest}
          accessibilityLabel={label}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.muted}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} accessibilityRole="button">
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: touchHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text, height: '100%' },
  toggle: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.brand },
  error: { fontFamily: fonts.body, fontSize: 12, color: colors.error },
});
