import { useState, useEffect } from "react";

export const useRaffleStatus = (raffleId: string) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(`raffle_${raffleId}_active`);
    setIsActive(stored !== null ? stored === "true" : true);
  }, [raffleId]);

  const toggleStatus = (newStatus: boolean) => {
    localStorage.setItem(`raffle_${raffleId}_active`, newStatus.toString());
    setIsActive(newStatus);
  };

  return { isActive, toggleStatus };
};

export const isRaffleActive = (raffleId: string): boolean => {
  const stored = localStorage.getItem(`raffle_${raffleId}_active`);
  return stored !== null ? stored === "true" : true;
};
