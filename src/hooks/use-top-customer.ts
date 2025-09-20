import { useState, useEffect } from "react";

interface TopCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalTickets: number;
}

export const useTopCustomer = () => {
  const [topCustomer, setTopCustomer] = useState<TopCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCustomer = async () => {
      try {
        const url =
          window.location.hostname === "localhost"
            ? "https://riffaquemantequilla.onrender.com/api/raffle/top-customer"
            : "https://riffaquemantequilla.onrender.com/api/raffle/top-customer";

        const response = await fetch(url);

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setTopCustomer(data.topCustomer);
      } catch (error) {
        console.error("Error fetching top customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCustomer();
  }, []);

  return { topCustomer, loading };
};
