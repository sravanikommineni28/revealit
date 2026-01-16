import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform, Linking } from "react-native";

export type ImageSource = "camera" | "library";

export interface SelectedImage {
  uri: string;
  width: number;
  height: number;
}

export function useImagePicker() {
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status, canAskAgain } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") return true;
    if (!canAskAgain && Platform.OS !== "web") {
      try {
        await Linking.openSettings();
      } catch {}
    }
    return false;
  };

  const requestLibraryPermission = async (): Promise<boolean> => {
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") return true;
    if (!canAskAgain && Platform.OS !== "web") {
      try {
        await Linking.openSettings();
      } catch {}
    }
    return false;
  };

  const pickImage = async (
    source: ImageSource
  ): Promise<SelectedImage | null> => {
    setIsLoading(true);
    try {
      if (source === "camera") {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return null;

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 1,
        });

        if (result.canceled || !result.assets[0]) return null;

        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        };
      } else {
        const hasPermission = await requestLibraryPermission();
        if (!hasPermission) return null;

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 1,
        });

        if (result.canceled || !result.assets[0]) return null;

        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        };
      }
    } catch (error) {
      console.error("Failed to pick image:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pickImage,
    isLoading,
  };
}
