import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { Button } from "@/components/ui/base/button";
import { AlertTriangle, Trophy } from "lucide-react";

interface FinishRaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  raffleName: string;
  isLoading?: boolean;
}

export function FinishRaffleModal({
  isOpen,
  onClose,
  onConfirm,
  raffleName,
  isLoading = false,
}: FinishRaffleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Trophy className="w-5 h-5" />
            Realizar Sorteo
          </DialogTitle>
          <DialogDescription className="text-left">
            ¿Estás listo para realizar el sorteo de la rifa "{raffleName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">
              🎯 Se realizará el sorteo
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Se seleccionará automáticamente el ticket ganador</li>
              <li>• La rifa se marcará como finalizada</li>
              <li>• No se podrán vender más tickets</li>
              <li>• Se notificará al ganador</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Esta acción es irreversible
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Trophy className="w-4 h-4 mr-2" />
            {isLoading ? "Realizando Sorteo..." : "Realizar Sorteo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
