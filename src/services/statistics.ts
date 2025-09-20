import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { raffleService } from "./raffle";

export interface TopCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface TopCustomerResponse {
  customer: TopCustomer;
  totalTickets: number;
}

export interface Winner {
  id: string;
  raffleTitle: string;
  prize: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  drawnAt: string;
}

export interface WinnerResponse {
  winner: Winner;
}

export interface LastWinner {
  raffleImage?: string;
  customerName: string;
  ticketNumber: string;
  prize: string;
  raffleTitle: string;
  drawnAt: string;
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

      // Si es una rifa mock, devolver estadísticas vacías
      if (currentRaffle.id === "mock-raffle") {
        return {
          totalSales: 0,
          ticketsSold: 0,
          totalTickets: 0,
          remainingTickets: 0,
          soldPercentage: 0,
          topCustomer: null,
          currentRaffle: null,
        };
      }

      // Get top customer data
      const topCustomer: TopCustomerResponse | null = null;
      // Top customer data is now handled by useTopCustomer hook

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
      // Devolver estadísticas por defecto en caso de error
      return {
        totalSales: 0,
        ticketsSold: 0,
        totalTickets: 0,
        remainingTickets: 0,
        soldPercentage: 0,
        topCustomer: null,
        currentRaffle: null,
      };
    }
  },

  async getLastWinner(): Promise<LastWinner | null> {
    try {
      const response = await api.get("/admin/winners/history");
      return response.data.winner;
    } catch (error) {
      console.error("Error fetching last winner:", error);
      return null;
    }
  },
};
