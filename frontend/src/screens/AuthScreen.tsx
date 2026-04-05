import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    if (mode === "register") return !!name.trim() && !!email.trim() && password.length >= 6;
    return !!email.trim() && password.length >= 6;
  }, [email, mode, name, password]);

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    const result = mode === "login"
      ? await login(email.trim(), password)
      : await register(name.trim(), email.trim(), password, "student");
    setLoading(false);
    if (!result.ok) {
      Alert.alert("BenAI", result.message || "Something went wrong");
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 16 }}>
          <View style={styles.logoWrap}>
            <View style={styles.logo}>
              <Ionicons name="sparkles-outline" size={30} color={colors.accent3} />
            </View>
          </View>
          <SectionHeader title="Welcome to BenAI" subtitle="AI-powered campus assistant for Bennett University" />
          <GlassCard style={styles.card}>
            <View style={styles.switchRow}>
              <Text onPress={() => setMode("login")} style={[styles.switchItem, mode === "login" && styles.switchActive]}>Login</Text>
              <Text onPress={() => setMode("register")} style={[styles.switchItem, mode === "register" && styles.switchActive]}>Register</Text>
            </View>

            {mode === "register" ? (
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
              />
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <PrimaryButton
              label={mode === "login" ? "Sign In" : "Create Account"}
              onPress={submit}
              loading={loading}
              disabled={!canSubmit}
            />

            <Text style={styles.note}>
              Uses existing BenAI services. For device testing, set EXPO_PUBLIC_FRONTEND_URL to your machine IP.
            </Text>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  logoWrap: { alignItems: "center", marginTop: 4, marginBottom: 4 },
  logo: {
    fontSize: 34,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.09)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center"
  },
  card: { marginTop: 14, gap: 12 },
  switchRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 6,
    borderRadius: 14,
    marginBottom: 8
  },
  switchItem: {
    flex: 1,
    textAlign: "center",
    color: colors.muted,
    fontWeight: "700",
    paddingVertical: 8,
    borderRadius: 10
  },
  switchActive: { backgroundColor: "rgba(124,136,255,0.35)", color: colors.text },
  input: {
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    color: colors.text,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48
  },
  note: { color: colors.muted, fontSize: 12, marginTop: 8, lineHeight: 18, opacity: 0.9 }
});
