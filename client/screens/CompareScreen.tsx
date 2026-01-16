import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ViewShot from "react-native-view-shot";
import * as Haptics from "expo-haptics";

import { ComparisonSlider } from "@/components/ComparisonSlider";
import { ActionButton } from "@/components/ActionButton";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { useTheme } from "@/hooks/useTheme";
import { saveToGallery, shareImage } from "@/lib/imageUtils";
import { Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type CompareRouteProp = RouteProp<RootStackParamList, "Compare">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get("window").width;
const PADDING = Spacing.lg * 2;
const SLIDER_WIDTH = SCREEN_WIDTH - PADDING;

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<CompareRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);

  const { beforeUri, afterUri, beforeWidth, beforeHeight, afterWidth, afterHeight } =
    route.params;

  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const aspectRatio = Math.min(
    beforeWidth / beforeHeight,
    afterWidth / afterHeight
  );
  const sliderHeight = SLIDER_WIDTH / aspectRatio;
  const maxHeight = Dimensions.get("window").height * 0.5;
  const finalHeight = Math.min(sliderHeight, maxHeight);
  const finalWidth = finalHeight * aspectRatio;

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture?.();
      if (uri) {
        const success = await saveToGallery(uri);
        if (success) {
          setShowSuccess(true);
        }
      }
    } catch (error) {
      console.error("Save failed:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture?.();
      if (uri) {
        await shareImage(uri);
      }
    } catch (error) {
      console.error("Share failed:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSharing(false);
    }
  }, []);

  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
          },
        ]}
      >
        <View style={styles.sliderContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 0.95 }}
          >
            <ComparisonSlider
              beforeUri={beforeUri}
              afterUri={afterUri}
              width={finalWidth}
              height={finalHeight}
            />
          </ViewShot>
        </View>

        <View style={styles.instructionContainer}>
          <View
            style={[
              styles.instructionBadge,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <View style={[styles.swipeIcon, { backgroundColor: theme.tint }]} />
            <View style={[styles.swipeLine, { backgroundColor: theme.border }]} />
            <View style={[styles.swipeIcon, { backgroundColor: theme.tint }]} />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <ActionButton
              icon="download"
              label="Save"
              onPress={handleSave}
              loading={isSaving}
              variant="secondary"
              testID="button-save"
            />
          </View>
          <View style={styles.actionItem}>
            <ActionButton
              icon="share"
              label="Share"
              onPress={handleShare}
              loading={isSharing}
              variant="primary"
              testID="button-share"
            />
          </View>
        </View>

        <ActionButton
          icon="refresh-cw"
          label="New Comparison"
          onPress={() => navigation.goBack()}
          variant="outline"
          testID="button-new"
        />
      </View>

      <SuccessAnimation
        visible={showSuccess}
        onComplete={handleSuccessComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  instructionContainer: {
    marginTop: Spacing["2xl"],
    alignItems: "center",
  },
  instructionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    gap: Spacing.sm,
  },
  swipeIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  swipeLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionItem: {
    flex: 1,
  },
});
