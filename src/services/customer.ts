import { api } from "@/lib/api";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";
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
    // Validaciones más robustas antes de enviar
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d+\-\s()]{10,}$/;

    if (!data.name || !nameRegex.test(data.name.trim())) {
      throw new Error(
        "El nombre debe tener entre 2-50 caracteres y solo letras"
      );
    }

    const cleanPhone = data.phone?.replace(/[^\d]/g, "") || "";
    if (
      !data.phone ||
      !phoneRegex.test(data.phone.trim()) ||
      cleanPhone.length < 10
    ) {
      throw new Error("El teléfono debe tener al menos 10 dígitos válidos");
    }

    if (!data.email || !emailRegex.test(data.email.trim())) {
      throw new Error("El email debe tener un formato válido");
    }

    if (!data.paymentProof || !data.paymentProof.startsWith("http")) {
      throw new Error("Debe subir un comprobante de pago válido");
    }

    if (!data.raffleId) {
      throw new Error("ID de rifa requerido");
    }

    if (!data.quantity || data.quantity < 2) {
      throw new Error("La cantidad debe ser minimo 2");
    }

    // Limpiar datos antes de enviar
    const cleanData = {
      ...data,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
    };

    try {
      const response = await api.post<BuyTicketResponse>(
        "/customers/buy-ticket",
        cleanData
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Error en buyTickets:", error.message);

        // Mejorar mensajes de error específicos
        if (error.response?.status === 400) {
          const errorMsg =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Datos inválidos";
          throw new Error(`Error de validación: ${errorMsg}`);
        }

        if (error.response?.status === 422) {
          throw new Error(
            "Los datos enviados no son válidos. Verifica la información."
          );
        }

        if (error.response?.status && error.response.status >= 500) {
          throw new Error(
            "Error del servidor. Intenta nuevamente en unos momentos."
          );
        }
      }

      throw error;
    }
  },
};
