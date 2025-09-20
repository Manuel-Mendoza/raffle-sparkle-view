import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { Button } from "@/components/ui/base/button";
import { Trophy, User, Phone, Ticket, Users } from "lucide-react";
import type { Winner } from "@/services/statistics";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: Winner;
  totalParticipants: number;
  raffleName: string;
}

export const WinnerModal = ({
  isOpen,
  onClose,
  winner,
  totalParticipants,
  raffleName,
}: WinnerModalProps) => {
  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary text-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
            ¡Tenemos Ganador!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Confetti Effect */}
          <div className="text-center text-4xl">🎉 🏆 🎉</div>

          {/* Raffle Name */}
          <div className="text-center">
            <h3 className="font-semibold text-lg text-secondary">
              {raffleName}
            </h3>
          </div>

          {/* Winner Info */}
          <div className="bg-gradient-to-r from-primary/10 to-yellow-50 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ganador</p>
                <p className="font-semibold text-secondary">
                  {winner.customerName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-semibold text-secondary">
                  {winner.customerPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ticket Ganador</p>
                <p className="font-bold text-lg text-primary">
                  #{winner.ticketNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3">
            <div className="flex items-center gap-2 justify-center">
              <Users className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary">
                Total de participantes: <strong>{totalParticipants}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            <Trophy className="w-4 h-4 mr-2" />
            ¡Felicidades!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
