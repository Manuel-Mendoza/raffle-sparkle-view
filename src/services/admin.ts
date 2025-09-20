import { api } from "@/lib/api";
import { AxiosError } from "axios";

export interface CustomerTicket {
  customerId: string;
  customerName: string;
  customerPhone: string;
  raffleTitle: string;
  paymentMethod: string;
  paymentProof: string;
  createdAt: string;
  tickets: Array<{
    ticketId: string;
    ticketNumber: string;
  }>;
}

export interface PendingTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  paymentProof: string;
  quantity: number;
  total: number;
  raffleTitle: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface WinnerResponse {
  position: number;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  drawnAt: string;
}

export interface GetWinnersResponse {
  raffleId: string;
  winners: WinnerResponse[];
}

export interface DrawWinnerResponse {
  winner: Winner;
  totalParticipants: number;
}

export const adminService = {
  async getWinners(raffleId: string): Promise<WinnerResponse[]> {
    const response = await api.get<GetWinnersResponse>(
      `/admin/winners/${raffleId}`
    );
    return response.data.winners;
  },

  async getPendingTickets(): Promise<CustomerTicket[]> {
    try {
      console.log("Making API call to /admin/tickets/pending");
      const response = await api.get<{ customers: CustomerTicket[] }>(
        "/admin/tickets/pending"
      );
      console.log("API response:", response.data);
      return response.data.customers || [];
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error fetching pending tickets:", error);
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    }
  },

  async getApprovedTickets(): Promise<CustomerTicket[]> {
    try {
      const response = await api.get<{ customers: CustomerTicket[] }>(
        "/admin/tickets/approved"
      );
      return response.data.customers || [];
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error fetching approved tickets:", error);
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    }
  },

  async approveTicket(customerId: string): Promise<void> {
    await api.put(`/admin/customers/${customerId}/approve`);
  },

  async rejectTicket(customerId: string): Promise<void> {
    await api.put(`/admin/customers/${customerId}/reject`);
  },

  async setFirstWinner(
    raffleId: string,
    ticketNumber: string
  ): Promise<Winner> {
    const response = await api.post<Winner>("/admin/set-winner", {
      raffleId,
      ticketNumber,
    });
    return response.data;
  },

  async setSecondWinner(
    raffleId: string,
    ticketNumber: string
  ): Promise<Winner> {
    const response = await api.post<Winner>("/admin/set-second-winner", {
      raffleId,
      ticketNumber,
    });
    return response.data;
  },

  async setThirdWinner(
    raffleId: string,
    ticketNumber: string
  ): Promise<Winner> {
    const response = await api.post<Winner>("/admin/set-third-winner", {
      raffleId,
      ticketNumber,
    });
    return response.data;
  },

  async setFirstPlaceWinner(
    raffleId: string,
    ticketNumber: number
  ): Promise<DrawWinnerResponse> {
    const response = await api.post<DrawWinnerResponse>("/admin/set-winner", {
      raffleId,
      ticketNumber: ticketNumber.toString(),
    });
    return response.data;
  },

  async setSecondPlaceWinner(
    raffleId: string,
    ticketNumber: number
  ): Promise<DrawWinnerResponse> {
    const response = await api.post<DrawWinnerResponse>(
      "/admin/set-second-winner",
      {
        raffleId,
        ticketNumber: ticketNumber.toString(),
      }
    );
    return response.data;
  },

  async setThirdPlaceWinner(
    raffleId: string,
    ticketNumber: number
  ): Promise<DrawWinnerResponse> {
    const response = await api.post<DrawWinnerResponse>(
      "/admin/set-third-winner",
      {
        raffleId,
        ticketNumber: ticketNumber.toString(),
      }
    );
    return response.data;
  },

  async getLastWinner(): Promise<Winner | null> {
    try {
      const response = await api.get<Winner>("/admin/winners/history");
      return response.data;
    } catch (error) {
      console.error("Error fetching last winner:", error);
      return null;
    }
  },
};
