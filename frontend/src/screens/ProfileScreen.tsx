import React from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text } from "react-native";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Profile" subtitle="Session and service configuration" />

        <GlassCard>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.row}><Ionicons name="mail-outline" size={14} color={colors.accent3} /> {user?.email}</Text>
          <Text style={styles.row}><Ionicons name="shield-checkmark-outline" size={14} color={colors.accent3} /> Role: {user?.role}</Text>
        </GlassCard>

        <GlassCard>
          <Text style={styles.title}>BenAI Coverage</Text>
          <Text style={styles.line}>• AI chat for Bennett University context</Text>
          <Text style={styles.line}>• Faculty directory</Text>
          <Text style={styles.line}>• Academic events and deadlines</Text>
          <Text style={styles.line}>• Campus map and facilities</Text>
        </GlassCard>

        <PrimaryButton label="Logout" onPress={logout} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, paddingBottom: 22 },
  name: { color: colors.text, fontWeight: "800", fontSize: 24, marginBottom: 8 },
  title: { color: colors.text, fontWeight: "800", marginBottom: 8, fontSize: 17 },
  row: { color: colors.muted, marginBottom: 6, lineHeight: 20 },
  line: { color: colors.muted, marginBottom: 6, lineHeight: 20 }
});
