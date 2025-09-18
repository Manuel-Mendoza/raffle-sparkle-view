import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/ui/step-indicator";
import { TicketSelector } from "@/components/ui/ticket-selector";
import { UserForm } from "@/components/ui/user-form";
import { TicketNumbersModal } from "@/components/ui/ticket-numbers-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Raffle } from "@/services/raffle";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Copy,
} from "lucide-react";
import { customerService } from "@/services/customer";
import { toast } from "sonner";
import type { Ticket } from "@/types/api";
import { formatBsVSimple } from "@/lib/currency";

const steps = [
  { id: 1, title: "Datos y Boletos", description: "Información y cantidad" },
  { id: 2, title: "Pago", description: "Método y comprobante" },
  { id: 3, title: "Aceptar", description: "Ver números de tickets" },
];

const bankTransferData = {
  Nombre: "Renny Colmenarez",
  "Tipo de cuenta": "Cuenta Corriente",
  "Número de cuenta": "01050059111059513730",
  "Documento de identidad": "25520168",
};

const mobilePaymentData = {
  Banco: "0102",
  Celular: "04124796280",
  Cedula: "25520168",
};

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
      console.log("🎫 Iniciando compra con datos:", {
        name: purchaseData.userData.name,
        phone: purchaseData.userData.phone,
        email: purchaseData.userData.email,
        paymentMethod: purchaseData.paymentMethod,
        raffleId: raffleData.id,
        quantity: purchaseData.tickets,
        hasPaymentProof: !!purchaseData.paymentProof
      });

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
      console.error("❌ Error completo en handleFinalConfirm:", error);
      
      let errorMessage = "Error al procesar la compra";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as any;
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

  const handleModalClose = () => {
    setShowModal(false);
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
        </CardHeader>

        <CardContent className="min-h-[500px]">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Datos personales y boletos
                </h3>
                <p className="text-accent">
                  Completa tu información y selecciona la cantidad de boletos
                </p>
              </div>

              <UserForm
                onChange={(userData) =>
                  setPurchaseData((prev) => ({ ...prev, userData }))
                }
              />

              <div className="mt-6 pt-6 border-t border-accent/20">
                <h4 className="text-lg font-semibold text-secondary mb-4">
                  Selecciona tus boletos
                </h4>
                <TicketSelector
                  minTickets={1}
                  pricePerTicket={raffleData.ticketPrice}
                  onTicketChange={handleTicketChange}
                />
              </div>

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

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Método de pago y comprobante
                </h3>
                <p className="text-accent">
                  Selecciona tu método de pago y sube el comprobante de{" "}
                  {formatBsVSimple(purchaseData.total)}
                </p>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-secondary mb-4">
                    Selecciona tu método de pago
                  </h4>

                  <div className="space-y-3 mb-6">
                    {[
                      {
                        id: "Transferencia Bancaria",
                        name: "Transferencia Bancaria",
                        icon: "🏦",
                      },
                      { id: "Pago Movil", name: "Pago Móvil", icon: "📱" },
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() =>
                          setPurchaseData((prev) => ({
                            ...prev,
                            paymentMethod: method.id,
                          }))
                        }
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          purchaseData.paymentMethod === method.id
                            ? "border-primary bg-primary/10"
                            : "border-accent/20 hover:border-primary/30"
                        }`}
                      >
                        <span className="text-accent">{method.name}</span>
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          {method.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-secondary">
                        Datos para el pago:
                      </h5>
                    </div>
                    <div className="text-sm text-accent space-y-2">
                      {purchaseData.paymentMethod === "Transferencia Bancaria"
                        ? Object.entries(bankTransferData).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center"
                              >
                                <span>
                                  <strong>{key}:</strong> {value}
                                </span>
                                <Button
                                  onClick={() => handleCopy(value, key)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            )
                          )
                        : Object.entries(mobilePaymentData).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center"
                              >
                                <span>
                                  <strong>{key}:</strong> {value}
                                </span>
                                <Button
                                  onClick={() => handleCopy(value, key)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            )
                          )}
                      <div className="flex justify-between items-center">
                        <span>
                          <strong>Monto:</strong>{" "}
                          {formatBsVSimple(purchaseData.total)}
                        </span>
                        <Button
                          onClick={() =>
                            handleCopy(purchaseData.total.toString(), "Monto")
                          }
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

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

          {/* Step 3: Accept and View Ticket Numbers */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Aceptar y ver números de tickets
                </h3>
                <p className="text-accent">
                  Confirma tu compra para ver tus números de tickets
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
                      Aceptar y Ver Mis Números
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
                    Volver
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
