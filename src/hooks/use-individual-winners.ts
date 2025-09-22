import { useState, useEffect } from "react";
import { adminService, type WinnerResponse } from "@/services/admin";

interface IndividualWinners {
  first: WinnerResponse | null;
  second: WinnerResponse | null;
  third: WinnerResponse | null;
}

export function useIndividualWinners(raffleId: string | null) {
  const [winners, setWinners] = useState<IndividualWinners>({
    first: null,
    second: null,
    third: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!raffleId) {
      setWinners({ first: null, second: null, third: null });
      return;
    }

    const fetchWinners = async () => {
      setLoading(true);
      setError(null);

      try {
        const [first, second, third] = await Promise.all([
          adminService.getFirstPlaceWinner(raffleId),
          adminService.getSecondPlaceWinner(raffleId),
          adminService.getThirdPlaceWinner(raffleId),
        ]);

        setWinners({ first, second, third });
      } catch (err) {
        setError("Error al cargar los ganadores");
        console.error("Error fetching individual winners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [raffleId]);

  const refetch = async () => {
    if (!raffleId) return;

    setLoading(true);
    try {
      const [first, second, third] = await Promise.all([
        adminService.getFirstPlaceWinner(raffleId),
        adminService.getSecondPlaceWinner(raffleId),
        adminService.getThirdPlaceWinner(raffleId),
      ]);

      setWinners({ first, second, third });
    } catch (err) {
      setError("Error al recargar los ganadores");
      console.error("Error refetching individual winners:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    winners,
    loading,
    error,
    refetch,
  };
}
