import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  customerName: string;
}

export const PaymentProofModal = ({
  isOpen,
  onClose,
  imageUrl,
  customerName,
}: PaymentProofModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Comprobante de Pago - {customerName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Comprobante de pago"
              className="max-w-full max-h-[80vh] object-contain rounded border"
              style={{ imageRendering: "auto" }}
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.open(imageUrl, "_blank")}
            >
              Abrir en nueva pestaña
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
