import { useEffect, useState } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { RaffleCard } from "@/components/ui/raffle-card";
import { PurchaseSteps } from "@/components/ui/purchase-steps";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/favico.png";
import { raffleService, type Raffle } from "@/services/raffle";
import {
  statisticsService,
  type TopCustomerResponse,
} from "@/services/statistics";
import { toast } from "sonner";

const Index = () => {
  const [currentRaffle, setCurrentRaffle] = useState<Raffle | null>(null);
  const [topCustomer, setTopCustomer] = useState<TopCustomerResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching current raffle from API...");
        const raffle = await raffleService.getCurrentRaffle();
        console.log("Raffle data received:", raffle);
        setCurrentRaffle(raffle);

        // Fetch top customer data
        try {
          const stats = await statisticsService.getDashboardStats();
          setTopCustomer(stats.topCustomer);
        } catch (error) {
          console.warn("Could not fetch top customer data:", error);
        }
      } catch (error) {
        console.error("Error fetching current raffle:", error);
        toast.error(
          "Error al cargar la rifa actual. Verifica que la API esté funcionando."
        );
        // Remove fallback data to see API issues clearly
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-accent">Cargando rifa...</p>
        </div>
      </div>
    );
  }

  if (!currentRaffle) {
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

  // Convert raffle data for RaffleCard component
  const raffleCardData = {
    title: currentRaffle.title,
    totalTickets: currentRaffle.totalTickets,
    soldTickets: currentRaffle.soldTickets,
    price: currentRaffle.ticketPrice,
    prizes: [
      { position: "🏆 Gran Premio", prize: currentRaffle.prize, icon: "🏍️" },
    ],
    date: new Date(currentRaffle.endDate).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    }),
    time: "8:00 PM",
    features: [
      "Sorteo transparente en vivo",
      "Premio único garantizado",
      "Transmisión en directo",
    ],
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSection raffleData={currentRaffle} topCustomer={topCustomer} />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Raffle Info */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <RaffleCard {...raffleCardData} />
          </div>

          {/* Right Column - Purchase Steps */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <PurchaseSteps raffleData={currentRaffle} />
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Index;
