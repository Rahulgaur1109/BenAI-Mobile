import React from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";

const stats = [
  { label: "Faculty Members", value: "100+", icon: "people-outline" as const },
  { label: "Academic Dates", value: "170+", icon: "calendar-outline" as const },
  { label: "Programs", value: "30+", icon: "school-outline" as const },
  { label: "Support", value: "24/7", icon: "headset-outline" as const }
];

const features = [
  "AI chat powered by Gemini 2.5 Flash",
  "Faculty directory with cabin, email, phone",
  "Academic events timeline",
  "Campus map and facilities",
  "University programs and admission info"
];

export default function DashboardScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 26 }]} showsVerticalScrollIndicator={false}>
        <SectionHeader title="BenAI" subtitle="Your smart campus assistant" />

        <GlassCard>
          <Text style={styles.hero}>Bennett University in your pocket</Text>
          <Text style={styles.heroSub}>Get instant answers about events, faculty, classes, and facilities.</Text>
          <Text style={styles.heroTag}>Smooth. Smart. Student-first.</Text>
        </GlassCard>

        <View style={styles.grid}>
          {stats.map((item) => (
            <GlassCard key={item.label} style={styles.statCard}>
              <View style={styles.iconBadge}>
                <Ionicons name={item.icon} size={18} color={colors.accent3} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </GlassCard>
          ))}
        </View>

        <GlassCard>
          <Text style={styles.blockEyebrow}>WHAT YOU CAN DO</Text>
          <Text style={styles.blockTitle}>Core Features</Text>
          {features.map((feature) => (
            <Text key={feature} style={styles.feature}>• {feature}</Text>
          ))}
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 30, gap: 12 },
  hero: { color: colors.text, fontSize: 22, fontWeight: "800", lineHeight: 30 },
  heroSub: { color: colors.muted, marginTop: 8, lineHeight: 22, fontSize: 14 },
  heroTag: { color: colors.accent3, marginTop: 10, fontWeight: "700", fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "48%", minHeight: 132 },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79,209,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(79,209,255,0.35)"
  },
  statValue: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 6 },
  statLabel: { color: colors.muted, marginTop: 4, fontSize: 12, lineHeight: 16 },
  blockEyebrow: { color: colors.accent3, fontWeight: "700", letterSpacing: 1, fontSize: 10, marginBottom: 4 },
  blockTitle: { color: colors.text, fontWeight: "800", fontSize: 17, marginBottom: 8 },
  feature: { color: colors.muted, marginBottom: 6, lineHeight: 20 }
});
