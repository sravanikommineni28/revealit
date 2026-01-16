import React from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface ImageSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectLibrary: () => void;
}

export function ImageSourceModal({
  visible,
  onClose,
  onSelectCamera,
  onSelectLibrary,
}: ImageSourceModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleCamera = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectCamera();
  };

  const handleLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectLibrary();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          <View style={styles.handle} />
          <ThemedText type="h4" style={styles.title}>
            Select Image
          </ThemedText>

          <Pressable
            style={[styles.option, { backgroundColor: theme.backgroundSecondary }]}
            onPress={handleCamera}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.tint }]}>
              <Feather name="camera" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.optionContent}>
              <ThemedText type="body" style={styles.optionTitle}>
                Take Photo
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.optionHint, { color: theme.textSecondary }]}
              >
                Use your camera
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            style={[styles.option, { backgroundColor: theme.backgroundSecondary }]}
            onPress={handleLibrary}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.tint }]}>
              <Feather name="image" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.optionContent}>
              <ThemedText type="body" style={styles.optionTitle}>
                Photo Library
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.optionHint, { color: theme.textSecondary }]}
              >
                Choose from your photos
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            style={[styles.cancelButton, { borderColor: theme.border }]}
            onPress={onClose}
          >
            <ThemedText type="body" style={{ color: theme.tint }}>
              Cancel
            </ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D4D4D4",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  optionHint: {},
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
});
