import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientBackground from "../components/GradientBackground";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../constants/theme";
import { sendChatMessage } from "../services/api";
import { ChatMessage } from "../types";

const quickPrompts = [
  "Where is Mr. Ravikant Tyagi's cabin?",
  "Show me CSE professors",
  "Where is the gym?",
  "When are next exams?"
];

export default function ChatScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi, I am BenAI. Ask me about professors, events, campus map, and academic dates."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => !!input.trim() && !loading, [input, loading]);

  const send = async (forcedText?: string) => {
    const text = (forcedText ?? input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "assistant", text: error?.message || "Could not connect to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SectionHeader title="AI Chat" subtitle="Gemini 2.5 Flash + Bennett context" />

      <FlatList
        data={messages}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.msgWrap, item.role === "user" ? styles.right : styles.left]}>
            <GlassCard style={[styles.msgCard, item.role === "user" ? styles.user : styles.assistant]}>
              <Text style={styles.msgText}>{item.text}</Text>
            </GlassCard>
          </View>
        )}
      />

      {messages.length === 1 ? (
        <View style={styles.quickRow}>
          {quickPrompts.map((q) => (
            <Text key={q} style={styles.quick} onPress={() => setInput(q)}>
              {q}
            </Text>
          ))}
        </View>
      ) : null}

      <GlassCard style={[styles.inputWrap, { marginBottom: tabBarHeight + Math.max(insets.bottom, 8) }]}> 
        <TextInput
          style={styles.input}
          placeholder="Ask anything about Bennett University..."
          placeholderTextColor={colors.muted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send()}
        />
        <PrimaryButton label={loading ? "Thinking..." : "Send"} onPress={() => send()} disabled={!canSend} loading={loading} />
      </GlassCard>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingBottom: 12, paddingTop: 4 },
  messagesList: { flex: 1 },
  msgWrap: { flexDirection: "row" },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  msgCard: { maxWidth: "85%", borderRadius: 18 },
  user: { backgroundColor: "rgba(124,136,255,0.34)" },
  assistant: { backgroundColor: "rgba(255,255,255,0.08)" },
  msgText: { color: colors.text, lineHeight: 22, fontSize: 14 },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  quick: {
    color: colors.text,
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    overflow: "hidden"
  },
  inputWrap: { marginTop: 2, gap: 10 },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: "rgba(255,255,255,0.08)"
  }
});
