import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function PrimaryButton({
  label,
  onPress,
  loading,
  disabled
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const blocked = disabled || loading;
  return (
    <Pressable onPress={onPress} disabled={blocked} style={({ pressed }) => [styles.wrap, pressed && !blocked ? styles.pressed : null, blocked ? styles.disabled : null]}>
      <LinearGradient colors={[colors.accent, colors.accent2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
        <View style={styles.inner}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>{label}</Text>}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7
  },
  button: {
    borderRadius: 14,
    minHeight: 50
  },
  inner: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  pressed: { transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.65 },
  label: { color: "white", fontSize: 16, fontWeight: "800" }
});
