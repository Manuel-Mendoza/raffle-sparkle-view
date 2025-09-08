import { api } from "@/lib/api";
import { raffleService } from "./raffle";

export interface TopCustomer {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface TopCustomerResponse {
  customer: TopCustomer;
  totalTickets: number;
}

export interface Winner {
  raffleTitle: string;
  prize: string;
  ticketNumber: string;
  customerName: string;
  drawnAt: string;
}

export interface WinnerResponse {
  winner: Winner;
}

export interface DashboardStatistics {
  totalSales: number;
  ticketsSold: number;
  totalTickets: number;
  remainingTickets: number;
  soldPercentage: number;
  topCustomer: TopCustomerResponse | null;
  currentRaffle: {
    title: string;
    prize: string;
    endDate: string;
    ticketPrice: number;
  } | null;
}

export const statisticsService = {
  async getDashboardStats(): Promise<DashboardStatistics> {
    try {
      // Get current raffle data
      const currentRaffle = await raffleService.getCurrentRaffle();

      // Get top customer data
      let topCustomer: TopCustomerResponse | null = null;
      try {
        const topCustomerResponse = await api.get<TopCustomerResponse>(
          "/customers/top-customer"
        );
        topCustomer = topCustomerResponse.data;
      } catch (error) {
        console.warn("No top customer data available:", error);
      }

      const totalSales = currentRaffle.soldTickets * currentRaffle.ticketPrice;
      const remainingTickets =
        currentRaffle.totalTickets - currentRaffle.soldTickets;
      const soldPercentage = Math.round(
        (currentRaffle.soldTickets / currentRaffle.totalTickets) * 100
      );

      return {
        totalSales,
        ticketsSold: currentRaffle.soldTickets,
        totalTickets: currentRaffle.totalTickets,
        remainingTickets,
        soldPercentage,
        topCustomer,
        currentRaffle: {
          title: currentRaffle.title,
          prize: currentRaffle.prize,
          endDate: currentRaffle.endDate,
          ticketPrice: currentRaffle.ticketPrice,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  },

  async getLastWinner(): Promise<Winner> {
    try {
      const response = await api.get<WinnerResponse>("/admin/winners/history");
      return response.data.winner;
    } catch (error) {
      console.error("Error fetching last winner:", error);
      throw error;
    }
  },
};
