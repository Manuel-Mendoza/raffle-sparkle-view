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
    // Validaciones antes de enviar
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
      throw new Error("El teléfono debe tener al menos 10 dígitos");
    }
    
    if (!data.email || !data.email.includes("@")) {
      throw new Error("El email debe ser válido");
    }
    
    if (!data.paymentProof || !data.paymentProof.startsWith("http")) {
      throw new Error("Debe subir un comprobante de pago válido");
    }
    
    if (!data.raffleId) {
      throw new Error("ID de rifa requerido");
    }
    
    if (!data.quantity || data.quantity < 1) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    console.log("✅ Validaciones pasadas. Enviando solicitud:", {
      ...data,
      paymentProof: data.paymentProof.substring(0, 50) + "..." // Solo mostrar parte de la URL
    });
    
    try {
      const response = await api.post<BuyTicketResponse>(
        "/customers/buy-ticket",
        data
      );
      console.log("✅ Respuesta exitosa:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en buyTickets:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        requestData: data
      });
      
      // Mejorar mensajes de error específicos
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || error.response?.data?.message || "Datos inválidos";
        throw new Error(`Error de validación: ${errorMsg}`);
      }
      
      throw error;
    }
  },

  async testConnection(): Promise<{ message: string }> {
    const response = await api.get<{ message: string }>("/customers/test");
    return response.data;
  },
};
