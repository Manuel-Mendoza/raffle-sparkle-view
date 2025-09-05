// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    username: string;
    email: string;
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
  availableTickets: number;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateRaffleRequest {
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  endDate: string;
  image?: string;
}

export interface UpdateRaffleRequest {
  title?: string;
  description?: string;
  prize?: string;
  ticketPrice?: number;
  totalTickets?: number;
  endDate?: string;
  isActive?: boolean;
  image?: string;
}

export interface UpdateRaffleResponse {
  message: string;
  raffle: ApiRaffle;
}

export interface DeleteRaffleResponse {
  message: string;
}

export interface CreateRaffleResponse {
  message: string;
  raffle: ApiRaffle;
}

// Customer Types
export interface BuyTicketRequest {
  name: string;
  phone: string;
  paymentMethod: string;
  paymentProof: string;
  raffleId: string;
  quantity: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  status: "pending" | "confirmed" | "rejected";
}

// Ticket Request Management Types
export interface TicketRequest {
  id: string;
  ticketNumber: string;
  status: "pending" | "confirmed" | "rejected";
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  paymentProof: string;
  raffleId: string;
  quantity: number;
  total: number;
  createdAt: string;
}

export interface GetTicketRequestsResponse {
  requests: TicketRequest[];
  totalPending: number;
}

export interface UpdateTicketStatusRequest {
  ticketId: string;
  status: "confirmed" | "rejected";
}

export interface UpdateTicketStatusResponse {
  message: string;
  ticket: TicketRequest;
}

export interface BuyTicketResponse {
  message: string;
  tickets: Ticket[];
  raffle: string;
  customer: string;
  total: number;
}

export interface UploadProofResponse {
  message: string;
  url: string;
}

// Error Types
export interface ApiError {
  error: string;
}

export interface AxiosErrorResponse {
  response?: {
    data?: ApiError;
    status?: number;
  };
  message?: string;
}
