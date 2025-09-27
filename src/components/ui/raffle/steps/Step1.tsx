import { Button } from "@/components/ui/base/button";
import { TicketSelector } from "@/components/ui/forms/ticket-selector";
import { UserForm } from "@/components/ui/forms/user-form";
import type { Raffle } from "@/services/raffle";
import { ArrowRight } from "lucide-react";

interface Step1Props {
  raffleData: Raffle;
  onNextStep: () => void;
  onTicketChange: (tickets: number, total: number) => void;
  onUserFormSubmit: (userData: {
    name: string;
    phone: string;
    email: string;
  }) => void;
  onZellePayment: () => void;
}

export function Step1({
  raffleData,
  onNextStep,
  onTicketChange,
  onUserFormSubmit,
  onZellePayment,
}: Step1Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">
          Datos personales y boletos
        </h3>
        <p className="text-accent">
          Completa tu información y selecciona la cantidad de boletos
        </p>
      </div>

      <UserForm onChange={onUserFormSubmit} />

      <div className="mt-6 pt-6 border-t border-accent/20">
        <h4 className="text-lg font-semibold text-secondary mb-4">
          Selecciona tus boletos
        </h4>
        <TicketSelector
          minTickets={2}
          pricePerTicket={raffleData.ticketPrice}
          onTicketChange={onTicketChange}
        />
      </div>

      <div className="flex sm:flex-row flex-col justify-end pt-4 sm:space-x-4 max-sm:space-y-4">
        <Button variant="outline" onClick={onZellePayment}>
          Pagar con Zelle (USD) 📲
        </Button>
        <Button
          onClick={onNextStep}
          className="bg-primary hover:bg-primary/90 px-8"
        >
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
