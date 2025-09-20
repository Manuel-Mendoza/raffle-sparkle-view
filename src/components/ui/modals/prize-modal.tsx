import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { OptimizedImage } from "@/components/ui/base/optimized-image";

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizeImage: string;
  prizeTitle: string;
  prizes: string;
}

export function PrizeModal({
  isOpen,
  onClose,
  prizeImage,
  prizeTitle,
  prizes,
}: PrizeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🏆 Premios de {prizeTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <OptimizedImage
              src={prizeImage}
              alt={`Premio de ${prizeTitle}`}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="space-y-3">
            {prizes.split(',').map((prize, index) => {
              const trimmedPrize = prize.trim();
              let emoji = '';
              
              if (index === 0) emoji = '🥇';
              else if (index === 1) emoji = '🥈';
              else if (index === 2) emoji = '🥉';
              else emoji = '🏆';

              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="font-semibold text-secondary">{index + 1}° Lugar</p>
                    <p className="text-accent">{trimmedPrize}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
