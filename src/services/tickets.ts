import { api } from "@/lib/api";
import {
  GetTicketRequestsResponse,
  UpdateTicketStatusRequest,
  UpdateTicketStatusResponse,
  TicketRequest,
} from "@/types/api";

export const ticketService = {
  async getPendingTickets(): Promise<TicketRequest[]> {
    try {
      // For now, we'll create mock data since the API endpoint doesn't exist yet
      // In a real implementation, this would be: const response = await api.get<GetTicketRequestsResponse>("/admin/tickets/pending");
      
      // Mock data that represents pending ticket requests
      const mockRequests: TicketRequest[] = [
        {
          id: "ticket-1",
          ticketNumber: "0157",
          status: "pending",
          customerName: "Juan Pérez",
          customerPhone: "1234567890",
          paymentMethod: "Transferencia Bancaria",
          paymentProof: "https://res.cloudinary.com/demo/image/upload/v1234567890/payment_proofs/sample1.jpg",
          raffleId: "raffle-1",
          quantity: 2,
          total: 100,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ticket-2",
          ticketNumber: "3842",
          status: "pending",
          customerName: "María García",
          customerPhone: "0987654321",
          paymentMethod: "Efectivo",
          paymentProof: "https://res.cloudinary.com/demo/image/upload/v1234567891/payment_proofs/sample2.jpg",
          raffleId: "raffle-1",
          quantity: 1,
          total: 50,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ticket-3",
          ticketNumber: "7291",
          status: "pending",
          customerName: "Carlos López",
          customerPhone: "5555555555",
          paymentMethod: "Transferencia Bancaria",
          paymentProof: "https://res.cloudinary.com/demo/image/upload/v1234567892/payment_proofs/sample3.jpg",
          raffleId: "raffle-1",
          quantity: 3,
          total: 150,
          createdAt: new Date().toISOString(),
        },
      ];

      return mockRequests;
    } catch (error) {
      console.error("Error fetching pending tickets:", error);
      // Return empty array as fallback
      return [];
    }
  },

  async updateTicketStatus(
    data: UpdateTicketStatusRequest
  ): Promise<UpdateTicketStatusResponse> {
    try {
      // For now, we'll simulate the API call
      // In a real implementation, this would be: const response = await api.put<UpdateTicketStatusResponse>("/admin/tickets/status", data);
      
      console.log(`Updating ticket ${data.ticketId} status to ${data.status}`);
      
      // Mock response
      const mockResponse: UpdateTicketStatusResponse = {
        message: `Ticket ${data.status === "confirmed" ? "confirmado" : "rechazado"} exitosamente`,
        ticket: {
          id: data.ticketId,
          ticketNumber: "0000",
          status: data.status,
          customerName: "Mock Customer",
          customerPhone: "1234567890",
          paymentMethod: "Mock Method",
          paymentProof: "",
          raffleId: "mock-raffle",
          quantity: 1,
          total: 50,
          createdAt: new Date().toISOString(),
        },
      };

      return mockResponse;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
  },

  async approveTicket(ticketId: string): Promise<UpdateTicketStatusResponse> {
    return this.updateTicketStatus({ ticketId, status: "confirmed" });
  },

  async rejectTicket(ticketId: string): Promise<UpdateTicketStatusResponse> {
    return this.updateTicketStatus({ ticketId, status: "rejected" });
  },
};