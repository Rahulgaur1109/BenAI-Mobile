import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../constants/theme";

export default function GlassCard({
  children,
  style
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.26)", "rgba(255,255,255,0.08)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientBorder, style]}
    >
      <View style={styles.wrap}>
        <BlurView intensity={58} tint="dark" style={styles.blur}>
          {children}
        </BlurView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 20,
    padding: 1,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7
  },
  wrap: {
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: colors.glassSoft
  },
  blur: {
    padding: 14
  }
});
