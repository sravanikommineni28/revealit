import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import ViewShot from "react-native-view-shot";

export interface ImageTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface CropRegion {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export async function cropImage(
  uri: string,
  crop: CropRegion
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        crop: {
          originX: Math.max(0, Math.round(crop.originX)),
          originY: Math.max(0, Math.round(crop.originY)),
          width: Math.round(crop.width),
          height: Math.round(crop.height),
        },
      },
    ],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export async function resizeImage(
  uri: string,
  width: number,
  height: number
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export async function saveToGallery(uri: string): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  } catch (error) {
    console.error("Failed to save to gallery:", error);
    return false;
  }
}

export async function shareImage(uri: string): Promise<boolean> {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      return false;
    }
    await Sharing.shareAsync(uri, {
      mimeType: "image/jpeg",
      dialogTitle: "Share your comparison",
    });
    return true;
  } catch (error) {
    console.error("Failed to share image:", error);
    return false;
  }
}

export async function captureViewAsImage(
  viewRef: React.RefObject<ViewShot>
): Promise<string | null> {
  try {
    if (!viewRef.current) return null;
    const uri = await viewRef.current.capture?.();
    return uri || null;
  } catch (error) {
    console.error("Failed to capture view:", error);
    return null;
  }
}

export function getImageDimensions(
  uri: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === "web") {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = uri;
    } else {
      const { Image: RNImage } = require("react-native");
      RNImage.getSize(
        uri,
        (width: number, height: number) => {
          resolve({ width, height });
        },
        reject
      );
    }
  });
}
