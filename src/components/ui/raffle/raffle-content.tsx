import { Suspense, useState } from "react";
import { HeroSection } from "@/components/ui/layout/hero-section";
import { RaffleCard } from "@/components/ui/raffle/raffle-card";
import { PurchaseSteps } from "@/components/ui/raffle/purchase-steps";
import { LoadingSkeleton } from "@/components/ui/base/loading-skeleton";
import { PrizeModal } from "@/components/ui/modals/prize-modal";
import type { Raffle } from "@/services/raffle";
import type { TopCustomerResponse } from "@/services/statistics";
import type { Winner } from "@/services/statistics";
import type { WinnerResponse } from "@/services/admin";

interface IndividualWinners {
  first: WinnerResponse | null;
  second: WinnerResponse | null;
  third: WinnerResponse | null;
}

interface RaffleContentProps {
  currentRaffle: Raffle;
  topCustomer: TopCustomerResponse | null;
  lastWinner: Winner | null;
  winners: WinnerResponse[];
  individualWinners?: IndividualWinners;
  winnersLoading?: boolean;
  onScrollToPurchase: () => void;
  onVerifyTickets: () => void;
  onRefetchWinners?: () => void;
}

export function RaffleContent({
  currentRaffle,
  topCustomer,
  lastWinner,
  winners,
  individualWinners,
  winnersLoading,
  onScrollToPurchase,
  onVerifyTickets,
  onRefetchWinners,
}: RaffleContentProps) {
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

  const handleViewPrize = () => {
    setIsPrizeModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSection
          raffleData={currentRaffle}
          topCustomer={topCustomer}
          lastWinner={lastWinner}
          winners={winners}
          individualWinners={individualWinners}
          winnersLoading={winnersLoading}
          onBuyTicket={onScrollToPurchase}
          onVerifyTickets={onVerifyTickets}
          onViewPrize={handleViewPrize}
          onRefetchWinners={onRefetchWinners}
        />
      </section>

      {/* Main Content */}
      <div id="purchase-section" className="w-full mx-auto px-4 py-8">
        {/* Right Column - Purchase Steps */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Suspense fallback={<LoadingSkeleton className="w-full h-96" />}>
            <PurchaseSteps raffleData={currentRaffle} />
          </Suspense>
        </div>
      </div>

      {/* Prize Modal */}
      <PrizeModal
        isOpen={isPrizeModalOpen}
        onClose={() => setIsPrizeModalOpen(false)}
        prizeImage={currentRaffle.image}
        prizeTitle={currentRaffle.title}
        prizes={currentRaffle.prize}
      />
    </>
  );
}
