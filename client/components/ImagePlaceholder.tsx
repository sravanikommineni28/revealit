import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface ImagePlaceholderProps {
  label: string;
  onPress: () => void;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ImagePlaceholder({
  label,
  onPress,
  testID,
}: ImagePlaceholderProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          borderColor: theme.border,
          backgroundColor: theme.backgroundDefault,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}
      >
        <Feather name="plus" size={32} color={theme.tint} />
      </View>
      <ThemedText type="body" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.hint, { color: theme.textSecondary }]}
      >
        Tap to select
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  label: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  hint: {
    textAlign: "center",
  },
});
