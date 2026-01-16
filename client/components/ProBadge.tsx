import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface ProBadgeProps {
  size?: "small" | "medium";
}

export function ProBadge({ size = "small" }: ProBadgeProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.badge,
        size === "medium" && styles.badgeMedium,
        { backgroundColor: theme.accent },
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          size === "medium" && styles.textMedium,
          { color: "#FFFFFF" },
        ]}
      >
        PRO
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeMedium: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  textMedium: {
    fontSize: 12,
  },
});
