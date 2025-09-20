import {
  Dialog,
  DialogContent,
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
  const firstPrize = prizes.split(',')[0]?.trim() || prizes;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 border-none bg-black/95">
        <div 
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onClick={onClose}
        >
          <div className="relative max-w-4xl max-h-full">
            <OptimizedImage
              src={prizeImage}
              alt={`Premio: ${firstPrize}`}
              className="w-full h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  🥇 {prizeTitle}
                </h2>
                <p className="text-lg md:text-xl text-yellow-400 font-semibold">
                  {firstPrize}
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 text-white/70 text-sm">
            Haz clic para cerrar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
