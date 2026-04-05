import React, { useEffect, useMemo, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";
import { fetchTeachers } from "../services/api";
import { Teacher } from "../types";

export default function TeachersScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading faculty...");

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchTeachers();
        setTeachers(rows);
      } catch (error: any) {
        setLoadingText(error?.message || "Could not fetch faculty list");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => {
      const values = [
        t.user?.name,
        t.name,
        t.department,
        t.specialization,
        t.cabin,
        t.phone,
        t.user?.email
      ].filter(Boolean).map((v) => String(v).toLowerCase());
      return values.some((v) => v.includes(q));
    });
  }, [search, teachers]);

  return (
    <GradientBackground>
      <SectionHeader title="Faculty Directory" subtitle={`${teachers.length} faculty members available`} />

      <TextInput
        style={styles.search}
        placeholder="Search by name, cabin, department..."
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.accent3} />
          <Text style={styles.loading}>{loadingText}</Text>
        </View>
      ) : teachers.length === 0 ? (
        <Text style={styles.loading}>No faculty records found.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 24 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GlassCard>
              <Text style={styles.name}>{item.user?.name || item.name || "Faculty"}</Text>
              <Text style={styles.meta}>{item.designation || "Professor"} • {item.department || "Department"}</Text>
              {!!item.cabin && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color={colors.accent3} />
                  <Text style={styles.info}>{item.cabin}</Text>
                </View>
              )}
              {!!item.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={14} color={colors.accent3} />
                  <Text style={styles.info}>{item.phone}</Text>
                </View>
              )}
              {!!item.user?.email && (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={14} color={colors.accent3} />
                  <Text style={styles.info}>{item.user.email}</Text>
                </View>
              )}
              {!!item.specialization && (
                <View style={styles.infoRow}>
                  <Ionicons name="flash-outline" size={14} color={colors.accent3} />
                  <Text style={styles.info}>{item.specialization}</Text>
                </View>
              )}
            </GlassCard>
          )}
        />
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  search: {
    height: 46,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 14,
    color: colors.text,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    marginBottom: 10
  },
  loadingWrap: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  loading: { color: colors.muted },
  list: { gap: 10, paddingBottom: 20 },
  name: { color: colors.text, fontSize: 18, fontWeight: "800" },
  meta: { color: colors.muted, marginTop: 4, marginBottom: 4, lineHeight: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  info: { color: colors.text, lineHeight: 20, flex: 1 }
});
