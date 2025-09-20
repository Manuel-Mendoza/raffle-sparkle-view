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
        const response = await fetch("/api/raffle/top-customer");
        
        if (!response.ok) {
          console.error(`HTTP Error: ${response.status} ${response.statusText}`);
          return;
        }

        const data = await response.json();
        setTopCustomer(data);
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
