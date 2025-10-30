import { useEffect, useState, lazy, Suspense } from "react";
import { LoadingSkeleton } from "@/components/ui/base/loading-skeleton";
import { Button } from "@/components/ui/base/button";
import { ComingSoonMessage } from "@/components/ui/layout/coming-soon-message";
import { RaffleContent } from "@/components/ui/raffle/raffle-content";
import { isRaffleActive } from "@/hooks/use-raffle-status";
import { SEOHead } from "@/components/seo/seo-head";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { MessageCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/favico.png";
import { raffleService, type Raffle } from "@/services/raffle";
import {
  adminService,
  type Winner,
  type WinnerResponse,
} from "@/services/admin";
import {
  statisticsService,
  type TopCustomerResponse,
} from "@/services/statistics";
import { useIndividualWinners } from "@/hooks/use-individual-winners";
import { Footer } from "@/components/Footer";

// Lazy load components
const TicketVerification = lazy(() =>
  import("@/components/ui/raffle/ticket-verification").then((m) => ({
    default: m.TicketVerification,
  }))
);

const Index = () => {
  const [currentRaffle, setCurrentRaffle] = useState<Raffle | null>(null);
  const [winners, setWinners] = useState<WinnerResponse[]>([]);
  const [topCustomer, setTopCustomer] = useState<TopCustomerResponse | null>(
    null
  );
  const [lastWinner, setLastWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Use the new individual winners hook
  const {
    winners: individualWinners,
    loading: winnersLoading,
    refetch: refetchWinners,
  } = useIndividualWinners(currentRaffle?.id || null);

  useEffect(() => {
    const handleWinnerDeclared = () => {
      refetchWinners();
    };

    window.addEventListener("winnerDeclared", handleWinnerDeclared);
    return () =>
      window.removeEventListener("winnerDeclared", handleWinnerDeclared);
  }, [refetchWinners]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch raffle data
        try {
          const allRaffles = await raffleService.getAllRaffles();
          const activeRaffle = allRaffles.find((raffle) => raffle.isActive);
          setCurrentRaffle(activeRaffle || null);

          // If there's an active raffle, fetch its winners (legacy support)
          if (activeRaffle) {
            try {
              const raffleWinners = await adminService.getWinners(
                activeRaffle.id
              );
              setWinners(raffleWinners);
            } catch (error) {
              setWinners([]);
            }
          }
        } catch (error) {
          setCurrentRaffle(null);
        }

        // Fetch last winner
        try {
          const winner = await adminService.getLastWinner();
          setLastWinner(winner);
        } catch (error) {
          setLastWinner(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToPurchase = () => {
    const element = document.getElementById("purchase-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVerifyTickets = () => {
    setShowVerificationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-accent">Cargando rifas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={
          currentRaffle
            ? `${currentRaffle.title} - Rifas.queMantequilla`
            : "Rifas.queMantequilla - Gana Increíbles Premios"
        }
        description={
          currentRaffle
            ? `${currentRaffle.description} Precio: ${currentRaffle.ticketPrice} Bs. ¡Participa ahora!`
            : "Participa en rifas exclusivas y gana premios increíbles como motos deportivas, dinero en efectivo y más."
        }
        image={
          currentRaffle?.image || "https://rifaquemantequilla.com/og-image.jpg"
        }
        structuredData={
          currentRaffle
            ? {
                "@context": "https://schema.org",
                "@type": "Event",
                name: currentRaffle.title,
                description: currentRaffle.description,
                image: currentRaffle.image,
                startDate: currentRaffle.startDate,
                endDate: currentRaffle.endDate,
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode:
                  "https://schema.org/OnlineEventAttendanceMode",
                location: {
                  "@type": "VirtualLocation",
                  url: "https://rifaquemantequilla.com",
                },
                offers: {
                  "@type": "Offer",
                  price: currentRaffle.ticketPrice,
                  priceCurrency: "VES",
                  availability: "https://schema.org/InStock",
                  url: "https://rifaquemantequilla.com",
                },
                organizer: {
                  "@type": "Organization",
                  name: "Rifas.queMantequilla",
                  url: "https://rifaquemantequilla.com",
                },
              }
            : undefined
        }
      />
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-secondary">
                  Rifas.queMantequilla
                </h1>
                <p className="text-sm text-accent">¡Tu oportunidad de ganar!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentRaffle && currentRaffle.isActive ? (
        <RaffleContent
          currentRaffle={currentRaffle}
          topCustomer={topCustomer}
          lastWinner={lastWinner}
          winners={winners}
          individualWinners={individualWinners}
          winnersLoading={winnersLoading}
          onScrollToPurchase={scrollToPurchase}
          onVerifyTickets={handleVerifyTickets}
          onRefetchWinners={refetchWinners}
        />
      ) : (
        <ComingSoonMessage />
      )}

      {/* Ticket Verification Modal */}
      <Dialog
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verificar Ticket</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<LoadingSkeleton className="w-full h-32" />}>
            <TicketVerification />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
