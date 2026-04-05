import React, { useEffect, useMemo, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";
import { fetchUniversityInfoByKey } from "../services/api";

type LocationRow = {
  name?: string;
  location?: string;
  description?: string | Record<string, any>;
  timings?: string | Record<string, any>;
  contact?: string | Record<string, any>;
};

function toDisplay(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => toDisplay(v)).filter(Boolean).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${toDisplay(v)}`)
      .filter((x) => x.trim() !== "")
      .join(" • ");
  }
  return String(value);
}

export default function MapInfoScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [rows, setRows] = useState<LocationRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const mapRow = await fetchUniversityInfoByKey("campusMap");
        const value = mapRow?.value || {};
        const combined: LocationRow[] = [];

        Object.values(value?.blocks || {}).forEach((list: any) => {
          if (Array.isArray(list)) combined.push(...list);
        });
        Object.values(value?.facilities || {}).forEach((item: any) => {
          if (Array.isArray(item)) combined.push(...item);
          else if (item) combined.push(item);
        });

        setRows(combined);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => [r.name, r.location, r.description].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)));
  }, [rows, search]);

  return (
    <GradientBackground>
      <SectionHeader title="Campus Map" subtitle="Find blocks, hostels, food spots, and services" />
      <TextInput
        style={styles.search}
        placeholder="Search campus location"
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 24 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.accent3} />
            <Text style={styles.empty}>Loading campus data...</Text>
          </View>
        ) : (
          <Text style={styles.empty}>No campus records found</Text>
        )}
        renderItem={({ item }) => (
          <GlassCard>
            <Text style={styles.name}>{toDisplay(item.name) || "Location"}</Text>
            {!!toDisplay(item.location) && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={colors.accent3} />
                <Text style={styles.info}>{toDisplay(item.location)}</Text>
              </View>
            )}
            {!!toDisplay(item.timings) && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={14} color={colors.accent3} />
                <Text style={styles.info}>{toDisplay(item.timings)}</Text>
              </View>
            )}
            {!!toDisplay(item.contact) && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={14} color={colors.accent3} />
                <Text style={styles.info}>{toDisplay(item.contact)}</Text>
              </View>
            )}
            {!!toDisplay(item.description) && <Text style={styles.desc}>{toDisplay(item.description)}</Text>}
          </GlassCard>
        )}
      />
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
  list: { gap: 10, paddingBottom: 20 },
  loadingWrap: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  empty: { color: colors.muted, marginTop: 20 },
  name: { color: colors.text, fontSize: 17, fontWeight: "800" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  info: { color: colors.text, lineHeight: 20, flex: 1 },
  desc: { color: colors.muted, marginTop: 6, lineHeight: 20 }
});
