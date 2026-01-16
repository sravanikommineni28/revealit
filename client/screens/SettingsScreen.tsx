import React, { useState, useCallback } from "react";
import { StyleSheet, View, ScrollView, Pressable, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ProBadge } from "@/components/ProBadge";
import { useTheme } from "@/hooks/useTheme";
import { useProStatus } from "@/hooks/useProStatus";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  showArrow?: boolean;
  showProBadge?: boolean;
  onPress?: () => void;
}

function SettingItem({
  icon,
  label,
  value,
  showArrow = true,
  showProBadge = false,
  onPress,
}: SettingItemProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Pressable
      style={[styles.settingItem, { backgroundColor: theme.backgroundDefault }]}
      onPress={handlePress}
      disabled={!onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name={icon} size={20} color={theme.tint} />
      </View>
      <View style={styles.settingContent}>
        <View style={styles.settingLabelRow}>
          <ThemedText type="body" style={styles.settingLabel}>
            {label}
          </ThemedText>
          {showProBadge ? <ProBadge /> : null}
        </View>
        {value ? (
          <ThemedText
            type="small"
            style={[styles.settingValue, { color: theme.textSecondary }]}
          >
            {value}
          </ThemedText>
        ) : null}
      </View>
      {showArrow && onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { isPro, unlockPro } = useProStatus();

  const handleUnlockPro = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await unlockPro();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [unlockPro]);

  const handleRateApp = useCallback(() => {
    const storeUrl = Platform.select({
      ios: "https://apps.apple.com/app/id0000000000",
      android: "https://play.google.com/store/apps/details?id=com.revealit.app",
      default: "",
    });
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(() => {});
    }
  }, []);

  const handlePrivacy = useCallback(() => {
    Linking.openURL("https://example.com/privacy").catch(() => {});
  }, []);

  const handleTerms = useCallback(() => {
    Linking.openURL("https://example.com/terms").catch(() => {});
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      {!isPro ? (
        <Pressable
          style={[styles.proCard, { backgroundColor: theme.tint }]}
          onPress={handleUnlockPro}
        >
          <View style={styles.proCardContent}>
            <View style={styles.proCardHeader}>
              <ProBadge size="medium" />
              <ThemedText type="h4" style={styles.proCardTitle}>
                Unlock RevealIt Pro
              </ThemedText>
            </View>
            <ThemedText type="body" style={styles.proCardDescription}>
              Get access to all premium features with a one-time purchase.
            </ThemedText>
            <View style={styles.proFeatures}>
              <View style={styles.proFeatureItem}>
                <Feather name="check" size={16} color="#FFFFFF" />
                <ThemedText type="small" style={styles.proFeatureText}>
                  Unlimited exports
                </ThemedText>
              </View>
              <View style={styles.proFeatureItem}>
                <Feather name="check" size={16} color="#FFFFFF" />
                <ThemedText type="small" style={styles.proFeatureText}>
                  Remove watermark
                </ThemedText>
              </View>
              <View style={styles.proFeatureItem}>
                <Feather name="check" size={16} color="#FFFFFF" />
                <ThemedText type="small" style={styles.proFeatureText}>
                  Priority support
                </ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.proCardAction}>
            <View style={styles.priceContainer}>
              <ThemedText type="h3" style={styles.priceText}>
                $4.99
              </ThemedText>
              <ThemedText type="small" style={styles.priceSubtext}>
                One-time
              </ThemedText>
            </View>
            <Feather name="arrow-right" size={24} color="#FFFFFF" />
          </View>
        </Pressable>
      ) : (
        <View
          style={[styles.proUnlockedCard, { backgroundColor: theme.success }]}
        >
          <Feather name="check-circle" size={24} color="#FFFFFF" />
          <ThemedText type="body" style={styles.proUnlockedText}>
            Pro features unlocked
          </ThemedText>
        </View>
      )}

      <View style={styles.section}>
        <ThemedText
          type="small"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          GENERAL
        </ThemedText>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="star"
            label="Rate RevealIt"
            onPress={handleRateApp}
          />
          <SettingItem
            icon="share-2"
            label="Share with Friends"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText
          type="small"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          LEGAL
        </ThemedText>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="shield"
            label="Privacy Policy"
            onPress={handlePrivacy}
          />
          <SettingItem
            icon="file-text"
            label="Terms of Service"
            onPress={handleTerms}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText
          type="small"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          ABOUT
        </ThemedText>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="info"
            label="Version"
            value="1.0.0"
            showArrow={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  proCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  proCardContent: {
    marginBottom: Spacing.lg,
  },
  proCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  proCardTitle: {
    color: "#FFFFFF",
  },
  proCardDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Spacing.md,
  },
  proFeatures: {
    gap: Spacing.xs,
  },
  proFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  proFeatureText: {
    color: "#FFFFFF",
  },
  proCardAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  priceText: {
    color: "#FFFFFF",
  },
  priceSubtext: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  proUnlockedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  proUnlockedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionContent: {
    gap: Spacing.sm,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  settingLabel: {
    fontWeight: "500",
  },
  settingValue: {},
});
