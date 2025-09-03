export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    username: string;
  };
}

export interface ApiError {
  error: string;
}

export interface AxiosErrorResponse {
  response?: {
    data?: ApiError;
  };
}

// Raffle API Types
export interface ApiRaffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  endDate: string;
  isActive: boolean;
}

export interface CreateRaffleRequest {
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  endDate: string;
}

export interface UpdateRaffleRequest {
  title?: string;
  description?: string;
  prize?: string;
  ticketPrice?: number;
  totalTickets?: number;
  endDate?: string;
  isActive?: boolean;
}

export interface CreateRaffleResponse {
  message: string;
  raffle: ApiRaffle;
}

export interface UpdateRaffleResponse {
  message: string;
  raffle: ApiRaffle;
}

export interface DeleteRaffleResponse {
  message: string;
}
