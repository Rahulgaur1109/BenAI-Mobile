import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>BENNETT UNIVERSITY</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  kicker: {
    color: "rgba(169,175,209,0.8)",
    letterSpacing: 1.4,
    fontSize: 10,
    marginBottom: 4,
    fontWeight: "700"
  },
  title: { color: colors.text, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.muted, marginTop: 4, fontSize: 14, lineHeight: 20 }
});
