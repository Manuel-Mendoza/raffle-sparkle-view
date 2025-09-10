import { api } from "@/lib/api";
import {
  BuyTicketRequest,
  BuyTicketResponse,
  UploadProofResponse,
} from "@/types/api";

export const customerService = {
  async uploadPaymentProof(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post<UploadProofResponse>(
      "/customers/upload-proof",
      formData
    );

    return response.data.url;
  },

  async buyTickets(data: BuyTicketRequest): Promise<BuyTicketResponse> {
    console.log("Sending buy ticket request:", data);
    const response = await api.post<BuyTicketResponse>(
      "/customers/buy-ticket",
      data
    );
    return response.data;
  },

  async testConnection(): Promise<{ message: string }> {
    const response = await api.get<{ message: string }>("/customers/test");
    return response.data;
  },
};
