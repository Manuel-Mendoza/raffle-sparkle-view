import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

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
  const ticketNumbers = tickets.map(t => t.ticketNumber).join(", ");

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(ticketNumbers);
    toast.success("Números copiados al portapapeles");
  };

  const handleWhatsAppShare = () => {
    const message = `¡Compra exitosa! 🎉\n\nRifa: ${raffleName}\nParticipante: ${customerName}\nNúmeros: ${ticketNumbers}\nTotal: $${total.toFixed(2)} USD\n\n¡Buena suerte! 🍀`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-primary flex items-center justify-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            ¡Compra Exitosa!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <h3 className="font-semibold text-secondary mb-2">Tus Números de la Suerte</h3>
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
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-accent">Rifa:</span>
                <span className="text-secondary font-medium">{raffleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Participante:</span>
                <span className="text-secondary font-medium">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Cantidad:</span>
                <span className="text-secondary font-medium">{tickets.length} tickets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Total:</span>
                <span className="text-primary font-bold">${total.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">Estado:</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
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

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
