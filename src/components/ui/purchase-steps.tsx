import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/ui/step-indicator";
import { TicketSelector } from "@/components/ui/ticket-selector";
import { UserForm } from "@/components/ui/user-form";
import { TicketNumbersModal } from "@/components/ui/ticket-numbers-modal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Raffle } from "@/services/raffle";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { customerService } from "@/services/customer";
import { toast } from "sonner";
import type { Ticket } from "@/types/api";
import { formatBsVSimple } from "@/lib/currency";

const steps = [
  { id: 1, title: "Boletos", description: "Selecciona cantidad" },
  { id: 2, title: "Datos", description: "Información personal" },
  { id: 3, title: "Pago", description: "Subir comprobante" },
  { id: 4, title: "Confirmación", description: "Revisar y confirmar" },
];

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
  const [purchaseData, setPurchaseData] = useState({
    tickets: 1,
    total: raffleData.ticketPrice,
    userData: null as { name: string; phone: string; email: string } | null,
    paymentProof: null as string | null,
    paymentMethod: "Transferencia Bancaria",
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
    setCurrentStep(3);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setLoading(true);
    try {
      console.log("Subiendo archivo:", file.name, file.type, file.size);
      const url = await customerService.uploadPaymentProof(file);
      setPurchaseData((prev) => ({ ...prev, paymentProof: url }));
      toast.success("Comprobante subido exitosamente");
    } catch (error: unknown) {
      console.error("Error completo:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al subir el comprobante";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalConfirm = async () => {
    if (!purchaseData.userData || !purchaseData.paymentProof) {
      toast.error("Faltan datos para completar la compra");
      return;
    }

    setLoading(true);
    try {
      const response = await customerService.buyTickets({
        name: purchaseData.userData.name,
        phone: purchaseData.userData.phone,
        email: purchaseData.userData.email,
        paymentMethod: purchaseData.paymentMethod,
        paymentProof: purchaseData.paymentProof,
        raffleId: raffleData.id,
        quantity: purchaseData.tickets,
      });

      // Configurar datos para el modal
      setPurchaseResult({
        tickets: response.tickets,
        customerName: response.customer,
        total: response.total,
      });

      setShowModal(true);
      toast.success("¡Compra procesada exitosamente!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al procesar la compra";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Resetear el formulario para nueva compra
    setCurrentStep(1);
    setPurchaseData({
      tickets: 1,
      total: raffleData.ticketPrice,
      userData: null,
      paymentProof: null,
      paymentMethod: "Transferencia Bancaria",
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
          <StepIndicator steps={steps} currentStep={currentStep} />
        </CardHeader>

        <CardContent className="min-h-[500px]">
          {/* Step 1: Ticket Selection */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Paso 1: Selecciona tus boletos
                </h3>
                <p className="text-accent">
                  Elige la cantidad de boletos que deseas comprar
                </p>
              </div>

              <TicketSelector
                minTickets={1}
                pricePerTicket={raffleData.ticketPrice}
                onTicketChange={handleTicketChange}
              />

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary/90 px-8"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: User Information */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Paso 2: Tus datos personales
                </h3>
                <p className="text-accent">
                  Necesitamos tu información para contactarte si ganas
                </p>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-accent">Boletos seleccionados:</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary text-primary-foreground"
                  >
                    {purchaseData.tickets} boletos
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-accent">Total a pagar:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatBsVSimple(purchaseData.total)}
                  </span>
                </div>
              </div>

              <UserForm
                onSubmit={handleUserFormSubmit}
                onPaymentMethodChange={(method) =>
                  setPurchaseData((prev) => ({
                    ...prev,
                    paymentMethod: method,
                  }))
                }
              />

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-accent/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Proof */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Paso 3: Comprobante de pago
                </h3>
                <p className="text-accent">
                  Sube tu comprobante de pago de{" "}
                  {formatBsVSimple(purchaseData.total)}
                </p>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-secondary mb-4">
                    Método de pago: {purchaseData.paymentMethod}
                  </h4>

                  <div className="space-y-4">
                    <Label
                      htmlFor="payment-proof"
                      className="text-accent font-medium"
                    >
                      Subir comprobante *
                    </Label>
                    <Input
                      id="payment-proof"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={loading}
                      className="border-accent/30"
                    />

                    {loading && (
                      <div className="flex items-center text-accent">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo comprobante...
                      </div>
                    )}

                    {purchaseData.paymentProof && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Comprobante subido exitosamente
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-accent/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>

                <Button
                  onClick={handleNextStep}
                  disabled={!purchaseData.paymentProof}
                  className="bg-primary hover:bg-primary/90 px-8"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Paso 4: Confirma tu compra
                </h3>
                <p className="text-accent">
                  Revisa todos los datos antes de confirmar
                </p>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-secondary mb-4">
                    Resumen de Compra
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-accent mb-2">Rifa:</h5>
                      <p className="text-secondary">{raffleData.title}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-accent mb-2">Boletos:</h5>
                      <p className="text-secondary">
                        {purchaseData.tickets} boletos
                      </p>
                      <p className="text-lg font-bold text-primary">
                        Total: {formatBsVSimple(purchaseData.total)}
                      </p>
                    </div>
                  </div>

                  {purchaseData.userData && (
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <h5 className="font-medium text-accent mb-2">
                        Datos del Participante:
                      </h5>
                      <p className="text-secondary">
                        {purchaseData.userData.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchaseData.userData.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchaseData.userData.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Método de pago: {purchaseData.paymentMethod}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center space-y-4">
                <Button
                  onClick={handleFinalConfirm}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow text-lg px-12 py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Confirmar Compra Final
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={loading}
                    className="border-accent/30"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Modificar Datos
                  </Button>
                </div>
              </div>
            </div>
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
        />
      )}
    </>
  );
}
