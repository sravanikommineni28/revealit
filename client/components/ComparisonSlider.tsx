import React, { useCallback } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";
import { BorderRadius } from "@/constants/theme";

interface ComparisonSliderProps {
  beforeUri: string;
  afterUri: string;
  width: number;
  height: number;
}

export function ComparisonSlider({
  beforeUri,
  afterUri,
  width,
  height,
}: ComparisonSliderProps) {
  const { theme } = useTheme();
  const sliderPosition = useSharedValue(width / 2);
  const isDragging = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      runOnJS(triggerHaptic)();
    })
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(width, event.x));
      sliderPosition.value = newPosition;
    })
    .onEnd(() => {
      isDragging.value = false;
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const newPosition = Math.max(0, Math.min(width, event.x));
    sliderPosition.value = withSpring(newPosition, {
      damping: 20,
      stiffness: 200,
    });
    runOnJS(triggerHaptic)();
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const beforeClipStyle = useAnimatedStyle(() => ({
    width: sliderPosition.value,
  }));

  const sliderHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderPosition.value - 24 }],
  }));

  const sliderLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderPosition.value - 1.5 }],
  }));

  const handleScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isDragging.value ? 1.15 : 1 }],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={[styles.container, { width, height }]}>
        <Image
          source={{ uri: afterUri }}
          style={styles.image}
          contentFit="cover"
        />

        <Animated.View style={[styles.beforeContainer, beforeClipStyle]}>
          <Image
            source={{ uri: beforeUri }}
            style={[styles.image, { width }]}
            contentFit="cover"
          />
          <View
            style={[
              styles.labelBadge,
              styles.beforeLabel,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Animated.Text style={[styles.labelText, { color: theme.text }]}>
              Before
            </Animated.Text>
          </View>
        </Animated.View>

        <View
          style={[
            styles.labelBadge,
            styles.afterLabel,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Animated.Text style={[styles.labelText, { color: theme.text }]}>
            After
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.sliderLine,
            { backgroundColor: "#FFFFFF" },
            sliderLineStyle,
          ]}
        />

        <Animated.View style={[styles.handleContainer, sliderHandleStyle]}>
          <Animated.View
            style={[
              styles.handle,
              { backgroundColor: theme.tint },
              handleScaleStyle,
            ]}
          >
            <Feather name="chevrons-left" size={12} color="#FFFFFF" />
            <View style={styles.handleDivider} />
            <Feather name="chevrons-right" size={12} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  beforeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden",
  },
  sliderLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  handleContainer: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  handleDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 2,
  },
  labelBadge: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  beforeLabel: {
    top: 12,
    left: 12,
  },
  afterLabel: {
    top: 12,
    right: 12,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
