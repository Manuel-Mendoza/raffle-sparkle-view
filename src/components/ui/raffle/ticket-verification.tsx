import { useState, useRef } from "react";
import { Button } from "@/components/ui/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { Search, User, Phone, Mail, Trophy, Ticket } from "lucide-react";
import { toast } from "sonner";
import { raffleService, TicketInfo } from "@/services/raffle";

export const TicketVerification = () => {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyTicket = async () => {
    const ticketNumber = digits.join("");
    if (ticketNumber.length !== 4) {
      toast.error("Ingresa los 4 dígitos del ticket");
      return;
    }

    setIsLoading(true);
    try {
      const ticket = await raffleService.verifyTicket(ticketNumber);
      setTicketInfo(ticket);
      toast.success("Ticket verificado correctamente");
    } catch (error) {
      setTicketInfo(null);
      toast.error("Ticket no encontrado");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDigits(["", "", "", ""]);
    setTicketInfo(null);
    inputRefs[0].current?.focus();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Verificar Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ingresa el número de ticket de 4 dígitos para verificar su estado
          </p>

          <div className="flex justify-center gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-primary/20 rounded-lg focus:border-primary focus:outline-none"
                maxLength={1}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={verifyTicket} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Verificando..." : "Verificar"}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Limpiar
            </Button>
          </div>
        </div>

        {ticketInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-800 mb-3">
              <Ticket className="w-5 h-5" />
              <span className="font-semibold">
                Ticket #{ticketInfo.ticketNumber}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  ticketInfo.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {ticketInfo.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                <span>{ticketInfo.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <span>{ticketInfo.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-600" />
                <span>{ticketInfo.rafflePrize}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-green-200">
              <p className="text-sm font-medium text-green-800">
                Rifa: {ticketInfo.raffleTitle}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
