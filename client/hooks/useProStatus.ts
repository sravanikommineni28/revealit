import { useState, useEffect, useCallback } from "react";
import { getIsPro, setIsPro } from "@/lib/storage";

export function useProStatus() {
  const [isPro, setIsProState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProStatus();
  }, []);

  const loadProStatus = async () => {
    try {
      const status = await getIsPro();
      setIsProState(status);
    } catch (error) {
      console.error("Failed to load pro status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unlockPro = useCallback(async () => {
    try {
      await setIsPro(true);
      setIsProState(true);
      return true;
    } catch (error) {
      console.error("Failed to unlock pro:", error);
      return false;
    }
  }, []);

  return {
    isPro,
    isLoading,
    unlockPro,
  };
}
