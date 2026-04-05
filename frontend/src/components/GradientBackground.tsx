import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

export default function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={[colors.bgStart, colors.bgMid, colors.bgEnd]} style={styles.gradient}>
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(124,136,255,0.18)"
  },
  orbTop: {
    width: 240,
    height: 240,
    right: -70,
    top: -50
  },
  orbBottom: {
    width: 280,
    height: 280,
    left: -110,
    bottom: -80,
    backgroundColor: "rgba(79,209,255,0.14)"
  }
});
