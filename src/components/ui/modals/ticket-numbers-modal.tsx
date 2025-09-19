import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { Button } from "@/components/ui/base/button";
import { Badge } from "@/components/ui/base/badge";
import { CheckCircle, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatBsVSimple } from "@/lib/currency";

interface Ticket {
  id: string;
  ticketNumber: string;
  status: "pending" | "confirmed" | "rejected";
}

interface TicketNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  customerName: string;
  raffleName: string;
  total: number;
}

export function TicketNumbersModal({
  isOpen,
  onClose,
  tickets,
  customerName,
  raffleName,
  total,
}: TicketNumbersModalProps) {
  const ticketNumbers = tickets.map((t) => t.ticketNumber).join(", ");

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(ticketNumbers);
    toast.success("Números copiados al portapapeles");
  };

  const handleWhatsAppShare = () => {
    const message = `¡Compra exitosa! 🎉\n\nRifa: ${raffleName}\nParticipante: ${customerName}\nNúmeros: ${ticketNumbers}\nTotal: ${formatBsVSimple(total)}\n\n¡Buena suerte! 🍀`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${tickets.length > 10 ? "max-w-lg" : "max-w-md"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-primary flex items-center justify-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            ¡Compra Exitosa!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <h3 className="font-semibold text-secondary mb-2">
              Tus Números de la Suerte
            </h3>

            {tickets.length <= 10 ? (
              // Mostrar todos los tickets si son 10 o menos
              <div className="flex flex-wrap gap-2 justify-center">
                {tickets.map((ticket) => (
                  <Badge
                    key={ticket.id}
                    variant="secondary"
                    className="bg-primary text-primary-foreground text-lg px-3 py-1"
                  >
                    {ticket.ticketNumber}
                  </Badge>
                ))}
              </div>
            ) : (
              // Vista compacta para muchos tickets
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-lg font-bold text-primary">
                    {tickets.length} tickets comprados
                  </p>
                  <p className="text-sm text-accent">
                    Números: {tickets[0].ticketNumber} -{" "}
                    {tickets[tickets.length - 1].ticketNumber}
                  </p>
                </div>

                {/* Contenedor con scroll para ver todos los números */}
                <div className="max-h-32 overflow-y-auto border border-accent/20 rounded-lg p-2 bg-muted/30">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {tickets.map((ticket) => (
                      <Badge
                        key={ticket.id}
                        variant="outline"
                        className="text-xs px-2 py-1 border-primary/30"
                      >
                        {ticket.ticketNumber}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-accent">Rifa:</span>
                <span className="text-secondary font-medium">{raffleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Participante:</span>
                <span className="text-secondary font-medium">
                  {customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Cantidad:</span>
                <span className="text-secondary font-medium">
                  {tickets.length} tickets
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Total:</span>
                <span className="text-primary font-bold">
                  {formatBsVSimple(total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Estado:</span>
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-600"
                >
                  Pendiente de aprobación
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Tus tickets están pendientes de aprobación.</p>
            <p>Te contactaremos pronto para confirmar tu participación.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleCopyNumbers}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Números
            </Button>

            <Button
              onClick={handleWhatsAppShare}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Compartir por WhatsApp
            </Button>

            <Button onClick={onClose} variant="outline" className="w-full">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
