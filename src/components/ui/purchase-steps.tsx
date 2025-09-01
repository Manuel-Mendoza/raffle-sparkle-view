import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/ui/step-indicator";
import { TicketSelector } from "@/components/ui/ticket-selector";
import { UserForm } from "@/components/ui/user-form";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";

const steps = [
  { id: 1, title: "Boletos", description: "Selecciona cantidad" },
  { id: 2, title: "Datos", description: "Información personal" },
  { id: 3, title: "Confirmación", description: "Revisar y pagar" }
];

interface PurchaseStepsProps {
  raffleData: any;
}

export function PurchaseSteps({ raffleData }: PurchaseStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseData, setPurchaseData] = useState({
    tickets: 2,
    total: 4.50,
    userData: null as any
  });
  
  const handleTicketChange = (tickets: number, total: number) => {
    setPurchaseData(prev => ({ ...prev, tickets, total }));
  };

  const handleUserFormSubmit = (userData: any) => {
    setPurchaseData(prev => ({ ...prev, userData }));
    setCurrentStep(3);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalConfirm = () => {
    // Here you would process the final purchase
    console.log("Final purchase:", purchaseData);
    alert("¡Compra realizada exitosamente! Te contactaremos pronto.");
  };

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/593978907442", "_blank");
  };

  return (
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
              minTickets={2}
              pricePerTicket={2.25}
              currency="USD"
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
            
            {/* Purchase Summary */}
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-accent">Boletos seleccionados:</span>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {purchaseData.tickets} boletos
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-accent">Total a pagar:</span>
                <span className="text-lg font-bold text-primary">
                  ${purchaseData.total.toFixed(2)} USD
                </span>
              </div>
            </div>
            
            <UserForm onSubmit={handleUserFormSubmit} />
            
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

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Paso 3: Confirma tu compra
              </h3>
              <p className="text-accent">
                Revisa todos los datos antes de confirmar
              </p>
            </div>
            
            {/* Final Summary */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-secondary mb-4">Resumen de Compra</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-accent mb-2">Rifa:</h5>
                      <p className="text-secondary">{raffleData.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Sorteo: {raffleData.date} a las {raffleData.time}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-accent mb-2">Boletos:</h5>
                      <p className="text-secondary">{purchaseData.tickets} boletos</p>
                      <p className="text-lg font-bold text-primary">
                        Total: ${purchaseData.total.toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                  
                  {purchaseData.userData && (
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <h5 className="font-medium text-accent mb-2">Datos del Participante:</h5>
                      <p className="text-secondary">{purchaseData.userData.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {purchaseData.userData.countryCode} {purchaseData.userData.phone}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center space-y-4">
              <Button 
                onClick={handleFinalConfirm}
                className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow text-lg px-12 py-3"
              >
                Confirmar Compra Final
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep}
                  className="border-accent/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Modificar Datos
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleWhatsAppContact}
                  className="border-accent/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}