import { Suspense } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { RaffleCard } from "@/components/ui/raffle-card";
import { PurchaseSteps } from "@/components/ui/purchase-steps";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import type { Raffle } from "@/services/raffle";
import type { TopCustomerResponse } from "@/services/statistics";
import type { Winner } from "@/services/admin";

interface RaffleContentProps {
  currentRaffle: Raffle;
  topCustomer: TopCustomerResponse | null;
  lastWinner: Winner | null;
  onScrollToPurchase: () => void;
  onVerifyTickets: () => void;
}

export function RaffleContent({
  currentRaffle,
  topCustomer,
  lastWinner,
  onScrollToPurchase,
  onVerifyTickets,
}: RaffleContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSection
          raffleData={currentRaffle}
          topCustomer={topCustomer}
          lastWinner={lastWinner}
          onBuyTicket={onScrollToPurchase}
          onVerifyTickets={onVerifyTickets}
        />
      </section>

      {/* Main Content */}
      <div id="purchase-section" className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Raffle Info */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <RaffleCard
              {...{
                title: currentRaffle.title,
                totalTickets: currentRaffle.totalTickets,
                soldTickets: currentRaffle.soldTickets,
                price: currentRaffle.ticketPrice,
                prizes: [
                  {
                    position: "🏆 Gran Premio",
                    prize: currentRaffle.prize,
                    icon: "🏍️",
                  },
                ],
                date: new Date(currentRaffle.endDate).toLocaleDateString(
                  "es-ES",
                  {
                    day: "numeric",
                    month: "long",
                  }
                ),
                time: "8:00 PM",
                features: [
                  "Sorteo transparente en vivo",
                  "Premio único garantizado",
                  "Transmisión en directo",
                ],
              }}
            />
          </div>

          {/* Right Column - Purchase Steps */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Suspense fallback={<LoadingSkeleton className="w-full h-96" />}>
              <PurchaseSteps raffleData={currentRaffle} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
