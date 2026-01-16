import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  IS_PRO: "@revealit:is_pro",
  ONBOARDING_COMPLETE: "@revealit:onboarding_complete",
} as const;

export async function getIsPro(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_PRO);
    return value === "true";
  } catch {
    return false;
  }
}

export async function setIsPro(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PRO, value ? "true" : "false");
  } catch (error) {
    console.error("Failed to save pro status:", error);
  }
}

export async function getOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === "true";
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      value ? "true" : "false"
    );
  } catch (error) {
    console.error("Failed to save onboarding status:", error);
  }
}
