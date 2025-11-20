import { useEffect, useState } from "react";

interface UseChapterPurchaseResult {
  isPurchased: boolean;
  isLoading: boolean;
  checkPurchaseStatus: () => Promise<void>;
}

/**
 * Hook pour vérifier si un utilisateur a acheté un chapitre
 */
export function useChapterPurchase(chapterId: string): UseChapterPurchaseResult {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkPurchaseStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/purchase/chapters/${chapterId}/status`);

      if (res.ok) {
        const data = await res.json();
        setIsPurchased(data.isPurchased);
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPurchaseStatus();
  }, [chapterId]);

  return {
    isPurchased,
    isLoading,
    checkPurchaseStatus,
  };
}
