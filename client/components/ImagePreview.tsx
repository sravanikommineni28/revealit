import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Image } from "expo-image";
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

interface ImagePreviewProps {
  uri: string;
  label: string;
  onPress: () => void;
  onRemove: () => void;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ImagePreview({
  uri,
  label,
  onPress,
  onRemove,
  testID,
}: ImagePreviewProps) {
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

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRemove();
  };

  return (
    <AnimatedPressable
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <Image source={{ uri }} style={styles.image} contentFit="cover" />
      <View style={styles.labelContainer}>
        <View
          style={[styles.labelBadge, { backgroundColor: theme.backgroundSecondary }]}
        >
          <ThemedText type="small" style={styles.labelText}>
            {label}
          </ThemedText>
        </View>
        <Pressable
          onPress={handleRemove}
          style={[styles.removeButton, { backgroundColor: theme.error }]}
          hitSlop={8}
        >
          <Feather name="x" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
  labelContainer: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  labelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  labelText: {
    fontWeight: "600",
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
