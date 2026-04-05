import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import DashboardScreen from "../screens/DashboardScreen";
import ChatScreen from "../screens/ChatScreen";
import TeachersScreen from "../screens/TeachersScreen";
import EventsScreen from "../screens/EventsScreen";
import MapInfoScreen from "../screens/MapInfoScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Chat: "chatbubble-ellipses",
  Faculty: "people",
  Calendar: "calendar",
  Campus: "map",
  Profile: "person"
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 10,
          borderRadius: 20,
          backgroundColor: "transparent",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10
        },
        tabBarBackground: () => (
          <BlurView
            intensity={55}
            tint="dark"
            style={{ flex: 1, borderRadius: 20, backgroundColor: "rgba(19,23,54,0.75)" }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700"
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconByRoute[route.name]} color={color} size={size} />
        )
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Faculty" component={TeachersScreen} />
      <Tab.Screen name="Calendar" component={EventsScreen} />
      <Tab.Screen name="Campus" component={MapInfoScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
