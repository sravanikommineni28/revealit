import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/hooks/useTheme";

interface SuccessAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

export function SuccessAnimation({
  visible,
  onComplete,
}: SuccessAnimationProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      opacity.value = withSpring(1);
      scale.value = withSpring(1, { damping: 12 });
      checkScale.value = withDelay(
        200,
        withSpring(1, { damping: 10 }, () => {
          if (onComplete) {
            scale.value = withDelay(
              800,
              withSequence(
                withSpring(1.1, { damping: 15 }),
                withSpring(0, { damping: 15 }, () => {
                  opacity.value = withSpring(0);
                  runOnJS(onComplete)();
                })
              )
            );
          }
        })
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
      checkScale.value = 0;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.success },
          containerStyle,
        ]}
      >
        <Animated.View style={checkStyle}>
          <Feather name="check" size={48} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
