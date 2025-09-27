import { useState } from "react";
import { Button } from "@/components/ui/base/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import { TicketNumbersModal } from "@/components/ui/modals/ticket-numbers-modal";

import type { Raffle } from "@/services/raffle";
import { customerService } from "@/services/customer";
import { toast } from "sonner";
import type { Ticket } from "@/types/api";
import type { PurchaseData } from "@/types/purchase";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";

interface PurchaseStepsProps {
  raffleData: Raffle;
}

export function PurchaseSteps({ raffleData }: PurchaseStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    tickets: Ticket[];
    customerName: string;
    total: number;
  } | null>(null);
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({
    tickets: 2,
    total: raffleData.ticketPrice * 2,
    userData: null,
    paymentProof: null,
    paymentMethod: "Pago Movil",
  });

  const handleTicketChange = (tickets: number, total: number) => {
    setPurchaseData((prev) => ({ ...prev, tickets, total }));
  };

  const handleUserFormSubmit = (userData: {
    name: string;
    phone: string;
    email: string;
  }) => {
    setPurchaseData((prev) => ({ ...prev, userData }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setLoading(true);
    try {
      const url = await customerService.uploadPaymentProof(file);
      setPurchaseData((prev) => ({ ...prev, paymentProof: url }));
      toast.success("Comprobante subido exitosamente");
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al subir el comprobante";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${field} copiado al portapapeles`);
      })
      .catch(() => {
        toast.error(`Error al copiar ${field}`);
      });
  };

  const handleFinalConfirm = async () => {
    if (!purchaseData.userData || !purchaseData.paymentProof) {
      toast.error("Faltan datos para completar la compra");
      return;
    }

    // Validaciones adicionales
    if (!purchaseData.userData.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!purchaseData.userData.phone.trim()) {
      toast.error("El teléfono es requerido");
      return;
    }

    if (!purchaseData.userData.email.trim()) {
      toast.error("El email es requerido");
      return;
    }

    if (!raffleData.id) {
      toast.error("Error: ID de rifa no válido");
      return;
    }

    if (purchaseData.tickets < 1) {
      toast.error("Debe seleccionar al menos 1 boleto");
      return;
    }

    setLoading(true);
    try {
      const response = await customerService.buyTickets({
        name: purchaseData.userData.name.trim(),
        phone: purchaseData.userData.phone.trim(),
        email: purchaseData.userData.email.trim(),
        paymentMethod: purchaseData.paymentMethod,
        paymentProof: purchaseData.paymentProof,
        raffleId: raffleData.id,
        quantity: purchaseData.tickets,
      });

      setPurchaseResult({
        tickets: response.tickets,
        customerName: response.customer,
        total: response.total,
      });

      setShowModal(true);
      toast.success("¡Compra procesada exitosamente!");
    } catch (error: unknown) {
      console.error("Error processing purchase:", error);

      let errorMessage = "Error al procesar la compra";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (apiError.response?.data?.error) {
          errorMessage = apiError.response.data.error;
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !purchaseData.userData) {
      toast.error("Por favor completa tus datos personales");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleZellePayment = () => {
    if (purchaseData.tickets < 30) {
      setPurchaseData((prev) => ({
        ...prev,
        tickets: 30,
        total: raffleData.ticketPrice * 30,
        paymentMethod: "Zelle",
      }));
    } else {
      setPurchaseData((prev) => ({ ...prev, paymentMethod: "Zelle" }));
    }
    handleNextStep();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentStep(1);
    setPurchaseData({
      tickets: 2,
      total: raffleData.ticketPrice * 2,
      userData: null,
      paymentProof: null,
      paymentMethod: "Pago Movil",
    });
    setPurchaseResult(null);
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-card">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-secondary">
            Proceso de Compra
          </CardTitle>
        </CardHeader>

        <CardContent className="min-h-[500px]">
          {currentStep === 1 && (
            <Step1
              raffleData={raffleData}
              onNextStep={handleNextStep}
              onTicketChange={handleTicketChange}
              onUserFormSubmit={handleUserFormSubmit}
              onZellePayment={handleZellePayment}
            />
          )}

          {currentStep === 2 && (
            <Step2
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onFileUpload={handleFileUpload}
              setPurchaseData={setPurchaseData}
              purchaseData={purchaseData}
              loading={loading}
              handleCopy={handleCopy}
            />
          )}

          {currentStep === 3 && (
            <Step3
              onFinalConfirm={handleFinalConfirm}
              onPrevStep={handlePrevStep}
              purchaseData={purchaseData}
              raffleData={raffleData}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de números de tickets */}
      {purchaseResult && (
        <TicketNumbersModal
          isOpen={showModal}
          onClose={handleModalClose}
          tickets={purchaseResult.tickets}
          customerName={purchaseResult.customerName}
          raffleName={raffleData.title}
          total={purchaseResult.total}
          paymentMethod={purchaseData.paymentMethod}
        />
      )}
    </>
  );
}
