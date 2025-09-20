import { Dialog, DialogContent } from "@/components/ui/base/dialog";
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
  const firstPrize = prizes.split(",")[0]?.trim() || prizes;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 border-none bg-black/95">
        <div
          className="relative h-full w-full cursor-pointer items-center justify-center motion-safe:animate-in motion-safe:fade-in"
          onClick={onClose}
        >
          <div className="relative max-h-full max-w-4xl">
            <OptimizedImage
              src={prizeImage}
              alt={`Premio: ${firstPrize}`}
              className="h-full w-full object-contain"
            />

            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="rounded-lg bg-black/70 p-4 backdrop-blur-sm">
                <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  🥇 {prizeTitle}
                </h2>
                <p className="text-lg font-semibold text-yellow-400 md:text-xl">
                  {firstPrize}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 text-sm text-white/70">
            Haz clic para cerrar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
