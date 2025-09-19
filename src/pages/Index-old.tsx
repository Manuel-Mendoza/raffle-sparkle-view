import { useEffect, useState, lazy, Suspense } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { RaffleCard } from "@/components/ui/raffle-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isRaffleActive } from "@/hooks/use-raffle-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, Loader2, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/favico.png";
import { raffleService, type Raffle } from "@/services/raffle";
import { adminService } from "@/services/admin";
import {
  statisticsService,
  type TopCustomerResponse,
} from "@/services/statistics";
import type { LastWinner } from "@/components/ui/hero-section";
import { toast } from "sonner";

// Lazy load components that are not immediately visible
const PurchaseSteps = lazy(() =>
  import("@/components/ui/purchase-steps").then((m) => ({
    default: m.PurchaseSteps,
  }))
);
const TicketVerification = lazy(() =>
  import("@/components/ui/ticket-verification").then((m) => ({
    default: m.TicketVerification,
  }))
);

const Index = () => {
  const [currentRaffle, setCurrentRaffle] = useState<Raffle | null>(null);
  const [topCustomer, setTopCustomer] = useState<TopCustomerResponse | null>(
    null
  );
  const [lastWinner, setLastWinner] = useState<LastWinner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching current raffle from API...");
        let raffleData = null;
        try {
          const raffle = await raffleService.getCurrentRaffle();
          console.log("Raffle data received:", raffle);
          setCurrentRaffle(raffle);
          raffleData = raffle;
        } catch (error) {
          console.log("No active raffle, fetching last winner...");
          // Si no hay rifa activa, obtener último ganador
          try {
            const winner = await statisticsService.getLastWinner();
            console.log("Last winner received:", winner);
            console.log("Setting lastWinner state with:", winner);
            setLastWinner(winner);
          } catch (winnerError) {
            console.log("No last winner available:", winnerError);
          }
        }

        // Fetch top customer data solo si hay rifa activa
        if (raffleData) {
          try {
            const stats = await statisticsService.getDashboardStats();
            setTopCustomer(stats.topCustomer);
          } catch (error) {
            console.warn("Could not fetch top customer data:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          "Error al cargar los datos. Verifica que la API esté funcionando."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/593978907442", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-secondary to-secondary/90 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <LoadingSkeleton className="w-48 h-8" variant="text" />
              <LoadingSkeleton className="w-24 h-8" variant="button" />
            </div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton variant="hero" />
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" />
            <div className="lg:col-span-2 space-y-4">
              <LoadingSkeleton className="h-32" />
              <LoadingSkeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRaffle && !lastWinner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-accent">
            No hay rifas disponibles en este momento
          </p>
        </div>
      </div>
    );
  }

  const scrollToPurchase = () => {
    const purchaseSection = document.getElementById("purchase-section");
    if (purchaseSection) {
      purchaseSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleVerifyTickets = () => {
    setShowVerificationModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary to-secondary/90 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-primary-foreground">
                Rifas.queMantequilla
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={handleWhatsAppContact}
                className="bg-accent hover:bg-accent/90 text-secondary text-sm sm:text-base px-3 sm:px-4"
              >
                <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Contáctanos</span>
                <span className="sm:hidden">Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* API Test Component - Solo en desarrollo */}

      {/* Contenido condicional: mostrar solo si hay rifa Y está activa */}
      {currentRaffle && isRaffleActive(currentRaffle.id) ? (
        <>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-8">
            <HeroSection
              raffleData={currentRaffle}
              topCustomer={topCustomer}
              lastWinner={lastWinner}
              onBuyTicket={scrollToPurchase}
              onVerifyTickets={handleVerifyTickets}
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
                <Suspense
                  fallback={<LoadingSkeleton className="w-full h-96" />}
                >
                  <PurchaseSteps raffleData={currentRaffle} />
                </Suspense>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Mensaje cuando la rifa está pausada - Pantalla completa */
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  🎉 ¡Próximamente Rifas Increíbles! 🎉
                </h3>
                <p className="text-lg text-secondary font-medium">
                  Estamos preparando rifas espectaculares para ti
                </p>
                <p className="text-accent max-w-md mx-auto">
                  Mantente atento a nuestras redes sociales y regresa pronto.
                  ¡Las mejores oportunidades de ganar están por venir!
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                <p className="text-sm font-semibold text-primary mb-2">
                  💡 Mientras tanto...
                </p>
                <p className="text-sm text-secondary">
                  Síguenos en nuestras redes sociales para ser el primero en
                  enterarte de las nuevas rifas
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <a
                    href="https://www.tiktok.com/@rifas.quemantequi?_t=ZM-8zrWw8Rs1y0&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    Síguenos en TikTok
                  </a>
                </Button>
                <Button className="bg-accent hover:bg-accent/90" asChild>
                  <a
                    href="https://www.instagram.com/rifas.quemantequilla?utm_source=qr&igsh=MTZ1cDQ5cHNwdGhhNQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Síguenos en Instagram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-secondary/10 py-6 sm:py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mt-4">
            <Link to="/login">
              <Button
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base px-4 sm:px-6"
              >
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </footer>

      {/* Ticket Verification Modal */}
      <Dialog
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      >
        <DialogContent className="max-w-md">
          <Suspense fallback={<LoadingSkeleton className="w-full h-40" />}>
            <TicketVerification />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
