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
        // Use full URL in development, relative in production
        const url =
          window.location.hostname === "localhost"
            ? "https://riffaquemantequilla.onrender.com/api/raffle/top-customer"
            : "/api/raffle/top-customer";

        console.log("Fetching top customer from:", url);
        const response = await fetch(url);

        console.log("Response status:", response.status);

        if (!response.ok) {
          console.error(
            `HTTP Error: ${response.status} ${response.statusText}`
          );
          return;
        }

        const data = await response.json();
        console.log("Parsed data:", data);
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
