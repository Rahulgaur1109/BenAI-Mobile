import React, { useEffect, useMemo, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";
import { fetchEvents } from "../services/api";
import { CampusEvent } from "../types";

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleString();
}

export default function EventsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [mode, setMode] = useState<"upcoming" | "past">("upcoming");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchEvents();
        setEvents(rows);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    const base = events.filter((e) => mode === "upcoming"
      ? new Date(e.startTime).getTime() >= now
      : new Date(e.startTime).getTime() < now);

    const q = search.trim().toLowerCase();
    const qFiltered = !q
      ? base
      : base.filter((e) => [e.title, e.description, e.location].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)));

    return qFiltered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [events, mode, search]);

  return (
    <GradientBackground>
      <SectionHeader title="Academic Calendar" subtitle="Important dates and events" />

      <View style={styles.row}>
        <Pressable onPress={() => setMode("upcoming")} style={[styles.tab, mode === "upcoming" && styles.tabActive]}>
          <Text style={styles.tabText}>Upcoming</Text>
        </Pressable>
        <Pressable onPress={() => setMode("past")} style={[styles.tab, mode === "past" && styles.tabActive]}>
          <Text style={styles.tabText}>Past</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search events..."
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 24 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.accent3} />
            <Text style={styles.empty}>Loading events...</Text>
          </View>
        ) : (
          <Text style={styles.empty}>No events found</Text>
        )}
        renderItem={({ item }) => (
          <GlassCard>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.accent3} />
              <Text style={styles.time}>{formatDate(item.startTime)}</Text>
            </View>
            {!!item.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={colors.accent3} />
                <Text style={styles.desc}>{item.location}</Text>
              </View>
            )}
            {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
          </GlassCard>
        )}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, marginBottom: 8 },
  tab: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  tabActive: { backgroundColor: "rgba(124,136,255,0.35)" },
  tabText: { color: colors.text, fontWeight: "700" },
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
  title: { color: colors.text, fontSize: 17, fontWeight: "800", lineHeight: 24 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  time: { color: colors.muted },
  desc: { color: colors.text, marginTop: 6, lineHeight: 20, flex: 1 }
});
