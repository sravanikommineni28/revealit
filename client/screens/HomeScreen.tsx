import React, { useState, useCallback } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { ImagePreview } from "@/components/ImagePreview";
import { ImageSourceModal } from "@/components/ImageSourceModal";
import { useTheme } from "@/hooks/useTheme";
import { useImagePicker, SelectedImage } from "@/hooks/useImagePicker";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { pickImage, isLoading } = useImagePicker();

  const [beforeImage, setBeforeImage] = useState<SelectedImage | null>(null);
  const [afterImage, setAfterImage] = useState<SelectedImage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeImageType, setActiveImageType] = useState<"before" | "after">(
    "before"
  );

  const handleImagePress = useCallback((type: "before" | "after") => {
    setActiveImageType(type);
    setModalVisible(true);
  }, []);

  const handleSelectCamera = useCallback(async () => {
    setModalVisible(false);
    const image = await pickImage("camera");
    if (image) {
      if (activeImageType === "before") {
        setBeforeImage(image);
      } else {
        setAfterImage(image);
      }
    }
  }, [activeImageType, pickImage]);

  const handleSelectLibrary = useCallback(async () => {
    setModalVisible(false);
    const image = await pickImage("library");
    if (image) {
      if (activeImageType === "before") {
        setBeforeImage(image);
      } else {
        setAfterImage(image);
      }
    }
  }, [activeImageType, pickImage]);

  const handleRemoveImage = useCallback((type: "before" | "after") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === "before") {
      setBeforeImage(null);
    } else {
      setAfterImage(null);
    }
  }, []);

  const handleCompare = useCallback(() => {
    if (beforeImage && afterImage) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate("Compare", {
        beforeUri: beforeImage.uri,
        afterUri: afterImage.uri,
        beforeWidth: beforeImage.width,
        beforeHeight: beforeImage.height,
        afterWidth: afterImage.width,
        afterHeight: afterImage.height,
      });
    }
  }, [beforeImage, afterImage, navigation]);

  const canCompare = beforeImage && afterImage;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="h3" style={styles.title}>
            Create Comparison
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Select your before and after images to create a stunning
            side-by-side comparison.
          </ThemedText>
        </View>

        <View style={styles.imagesContainer}>
          {beforeImage ? (
            <ImagePreview
              uri={beforeImage.uri}
              label="Before"
              onPress={() => handleImagePress("before")}
              onRemove={() => handleRemoveImage("before")}
              testID="preview-before"
            />
          ) : (
            <ImagePlaceholder
              label="Before"
              onPress={() => handleImagePress("before")}
              testID="placeholder-before"
            />
          )}

          {afterImage ? (
            <ImagePreview
              uri={afterImage.uri}
              label="After"
              onPress={() => handleImagePress("after")}
              onRemove={() => handleRemoveImage("after")}
              testID="preview-after"
            />
          ) : (
            <ImagePlaceholder
              label="After"
              onPress={() => handleImagePress("after")}
              testID="placeholder-after"
            />
          )}
        </View>

        <View
          style={[styles.tipsCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.tipsTitle}>
            Tips for best results
          </ThemedText>
          <View style={styles.tipItem}>
            <View style={[styles.tipBullet, { backgroundColor: theme.tint }]} />
            <ThemedText
              type="small"
              style={[styles.tipText, { color: theme.textSecondary }]}
            >
              Use images with similar framing and angle
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <View style={[styles.tipBullet, { backgroundColor: theme.tint }]} />
            <ThemedText
              type="small"
              style={[styles.tipText, { color: theme.textSecondary }]}
            >
              Same lighting conditions work best
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <View style={[styles.tipBullet, { backgroundColor: theme.tint }]} />
            <ThemedText
              type="small"
              style={[styles.tipText, { color: theme.textSecondary }]}
            >
              Align key elements in both photos
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <Button
          onPress={handleCompare}
          disabled={!canCompare}
          style={[styles.compareButton, { backgroundColor: theme.tint }]}
        >
          Compare Images
        </Button>
      </View>

      <ImageSourceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCamera={handleSelectCamera}
        onSelectLibrary={handleSelectLibrary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing["2xl"],
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    lineHeight: 22,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  tipsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  tipsTitle: {
    marginBottom: Spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.sm,
  },
  tipText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },
  compareButton: {
    width: "100%",
  },
});
