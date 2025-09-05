import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketSelectorProps {
  minTickets: number;
  pricePerTicket: number;
  currency: string;
  onTicketChange?: (tickets: number, total: number) => void;
}

export function TicketSelector({
  minTickets,
  pricePerTicket,
  currency,
  onTicketChange,
}: TicketSelectorProps) {
  const [tickets, setTickets] = useState(minTickets);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const total = tickets * pricePerTicket;

  const quickSelections = [2, 5, 10, 20, 30, 50];

  const updateTickets = (newTickets: number) => {
    const validTickets = Math.max(minTickets, newTickets);
    setTickets(validTickets);
    setIsCustomMode(false);
    setCustomValue("");
    onTicketChange?.(validTickets, validTickets * pricePerTicket);
  };

  const handleCustomInput = (value: string) => {
    setCustomValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= minTickets) {
      setTickets(numValue);
      onTicketChange?.(numValue, numValue * pricePerTicket);
    }
  };

  const enableCustomMode = () => {
    setIsCustomMode(true);
    setCustomValue(tickets.toString());
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-secondary">
          <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
          Compra aquí tus boletos
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Min. {minTickets} tickets por compra
          </Badge>
          <Badge variant="outline" className="border-accent text-accent">
            Precio por ticket: {pricePerTicket} {currency}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Selection Buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-accent">Selección rápida:</p>
          <div className="grid grid-cols-3 gap-2">
            {quickSelections.map((quantity) => (
              <Button
                key={quantity}
                variant="outline"
                size="sm"
                onClick={() => updateTickets(quantity)}
                className={cn(
                  "transition-all duration-200 hover:shadow-glow",
                  tickets === quantity && !isCustomMode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-accent/30 hover:border-primary/50"
                )}
              >
                +{quantity}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={enableCustomMode}
              className={cn(
                "transition-all duration-200 hover:shadow-glow col-span-3",
                isCustomMode
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-accent/30 hover:border-primary/50"
              )}
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Personalizado
            </Button>
          </div>
        </div>

        {/* Manual Selector or Custom Input */}
        <div className="flex items-center justify-center space-x-4 p-4 bg-accent/5 rounded-lg">
          {isCustomMode ? (
            <div className="flex items-center space-x-2 w-full max-w-xs">
              <Input
                type="number"
                inputMode="numeric"
                min={minTickets}
                value={customValue}
                onChange={(e) => handleCustomInput(e.target.value)}
                placeholder={`Mín. ${minTickets}`}
                className="text-center text-lg font-bold border-primary/30 focus:border-primary"
              />
              <span className="text-sm text-muted-foreground">tickets</span>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateTickets(tickets - 1)}
                disabled={tickets <= minTickets}
                className="h-12 w-12 rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[80px]">
                <div className="text-3xl font-bold text-primary">{tickets}</div>
                <div className="text-xs text-muted-foreground">tickets</div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => updateTickets(tickets + 1)}
                className="h-12 w-12 rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Total Display */}
        <div className="space-y-3 p-4 bg-gradient-to-r from-primary to-primary/80 rounded-lg text-primary-foreground">
          <div className="text-center">
            <p className="text-sm opacity-90">Total a Pagar</p>
            <p className="text-3xl font-bold">
              {total.toFixed(2)} {currency}
            </p>
          </div>

          <div className="text-center text-sm opacity-90">
            <p>¡Experimenta la Fiebre de Premios en Nuestra Gran Rifa!</p>
            <p className="font-medium">
              Gana Motos, Teléfonos y Premios en Efectivo!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
