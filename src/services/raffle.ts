import { api } from "@/lib/api";
import { AxiosError } from "axios";
import {
  ApiRaffle,
  CreateRaffleRequest,
  UpdateRaffleRequest,
  CreateRaffleResponse,
  UpdateRaffleResponse,
  DeleteRaffleResponse,
} from "@/types/api";

// Local Raffle interface to match the existing component
export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  status: "active" | "finished" | "draft";
  isActive: boolean;
  startDate: string;
  endDate: string;
  image: string;
}

// Utility functions to convert between API and local formats
export const convertApiRaffleToLocal = (apiRaffle: ApiRaffle): Raffle => {
  return {
    id: apiRaffle.id,
    title: apiRaffle.title,
    description: apiRaffle.description,
    prize: apiRaffle.prize,
    ticketPrice: apiRaffle.ticketPrice,
    totalTickets: apiRaffle.totalTickets,
    soldTickets: apiRaffle.soldTickets,
    status: apiRaffle.isActive ? "active" : "finished",
    isActive: apiRaffle.isActive,
    startDate: apiRaffle.createdAt,
    endDate: apiRaffle.endDate,
    image: apiRaffle.image || "", // Use image from API or empty string as fallback
  };
};

export const convertLocalRaffleToCreateRequest = (
  raffle: Omit<Raffle, "id" | "soldTickets" | "status" | "isActive">
): CreateRaffleRequest => {
  return {
    title: raffle.title,
    description: raffle.description,
    prize: raffle.prize,
    ticketPrice: raffle.ticketPrice,
    totalTickets: raffle.totalTickets,
    endDate: raffle.endDate,
    image: raffle.image,
  };
};

export const convertLocalRaffleToUpdateRequest = (
  raffle: Partial<Raffle>
): UpdateRaffleRequest => {
  const updateData: UpdateRaffleRequest = {};

  if (raffle.title !== undefined) updateData.title = raffle.title;
  if (raffle.description !== undefined)
    updateData.description = raffle.description;
  if (raffle.prize !== undefined) updateData.prize = raffle.prize;
  if (raffle.ticketPrice !== undefined)
    updateData.ticketPrice = raffle.ticketPrice;
  if (raffle.totalTickets !== undefined)
    updateData.totalTickets = raffle.totalTickets;
  if (raffle.endDate !== undefined) updateData.endDate = raffle.endDate;
  if (raffle.status !== undefined)
    updateData.isActive = raffle.status === "active";

  return updateData;
};

export interface TicketInfo {
  ticketNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  raffleTitle: string;
  rafflePrize: string;
}

export const raffleService = {
  async getCurrentRaffle(): Promise<Raffle> {
    try {
      const response = await api.get<ApiRaffle>("/raffle/current");
      return convertApiRaffleToLocal(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          // Crear una rifa mock para evitar errores en el frontend
          return {
            id: "mock-raffle",
            title: "No hay rifa activa",
            description: "Crea una nueva rifa para comenzar",
            prize: "Sin premio",
            ticketPrice: 0,
            totalTickets: 0,
            soldTickets: 0,
            status: "draft" as const,
            isActive: false,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            image: "",
          };
        }
      }
      // Re-throw other errors
      throw error;
    }
  },

  async getAllRaffles(): Promise<Raffle[]> {
    try {
      const response = await api.get<{ raffles: ApiRaffle[] }>("/raffle/all");
      return response.data.raffles.map(convertApiRaffleToLocal);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  async createRaffle(
    data: Omit<Raffle, "id" | "soldTickets" | "status" | "isActive">
  ): Promise<Raffle> {
    const createRequest = convertLocalRaffleToCreateRequest(data);
    const response = await api.post<CreateRaffleResponse>(
      "/raffle/create",
      createRequest
    );
    return convertApiRaffleToLocal(response.data.raffle);
  },

  async deleteRaffle(id: string): Promise<void> {
    await api.delete(`/raffle/${id}`);
  },

  async pauseRaffle(id: string): Promise<void> {
    await api.put(`/raffle/${id}/pause`);
  },

  async playRaffle(id: string): Promise<void> {
    await api.put(`/raffle/${id}/play`);
  },

  async verifyTicket(ticketNumber: string): Promise<TicketInfo> {
    const response = await api.post<{ ticket: TicketInfo }>("/raffle/verify", {
      ticketNumber,
    });
    return response.data.ticket;
  },
};
