import { api } from "@/lib/api";
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
    startDate: apiRaffle.createdAt,
    endDate: apiRaffle.endDate,
    image: "", // API doesn't provide image, so we'll use empty string
  };
};

export const convertLocalRaffleToCreateRequest = (
  raffle: Omit<Raffle, "id" | "soldTickets" | "status">
): CreateRaffleRequest => {
  return {
    title: raffle.title,
    description: raffle.description,
    prize: raffle.prize,
    ticketPrice: raffle.ticketPrice,
    totalTickets: raffle.totalTickets,
    endDate: raffle.endDate,
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

export const raffleService = {
  async getCurrentRaffle(): Promise<Raffle> {
    const response = await api.get<ApiRaffle>("/raffle/current");
    return convertApiRaffleToLocal(response.data);
  },

  async getAllRaffles(): Promise<Raffle[]> {
    const response = await api.get<{ raffles: ApiRaffle[] }>("/raffle/all");
    return response.data.raffles.map(convertApiRaffleToLocal);
  },

  async createRaffle(
    data: Omit<Raffle, "id" | "soldTickets" | "status">
  ): Promise<Raffle> {
    const createRequest = convertLocalRaffleToCreateRequest(data);
    const response = await api.post<CreateRaffleResponse>(
      "/raffle/create",
      createRequest
    );
    return convertApiRaffleToLocal(response.data.raffle);
  },
};
