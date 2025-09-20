import { useEffect, useState, lazy, Suspense } from "react";
import { LoadingSkeleton } from "@/components/ui/base/loading-skeleton";
import { Button } from "@/components/ui/base/button";
import { ComingSoonMessage } from "@/components/ui/layout/coming-soon-message";
import { RaffleContent } from "@/components/ui/raffle/raffle-content";
import { isRaffleActive } from "@/hooks/use-raffle-status";
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
import { adminService, type Winner } from "@/services/admin";
import {
  statisticsService,
  type TopCustomerResponse,
} from "@/services/statistics";

// Lazy load components
const TicketVerification = lazy(() =>
  import("@/components/ui/raffle/ticket-verification").then((m) => ({
    default: m.TicketVerification,
  }))
);

const Index = () => {
  const [currentRaffle, setCurrentRaffle] = useState<Raffle | null>(null);
  const [topCustomer, setTopCustomer] = useState<TopCustomerResponse | null>(
    null
  );
  const [lastWinner, setLastWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch raffle data
        try {
          const allRaffles = await raffleService.getAllRaffles();
          const activeRaffle = allRaffles.find((raffle) => raffle.isActive);
          setCurrentRaffle(activeRaffle || null);
        } catch (error) {
          console.log("No raffles available");
          setCurrentRaffle(null);
        }

        // Fetch statistics
        try {
          const topCustomerData = await statisticsService.getTopCustomer();
          setTopCustomer(topCustomerData);
        } catch (error) {
          console.log("No top customer data available");
        }

        // Fetch last winner
        try {
          const winner = await adminService.getLastWinner();
          setLastWinner(winner);
        } catch (error) {
          console.log("No winner data available");
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
              {currentRaffle && currentRaffle.isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVerifyTickets}
                  className="text-accent hover:text-secondary"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Verificar Ticket
                </Button>
              )}
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
          onScrollToPurchase={scrollToPurchase}
          onVerifyTickets={handleVerifyTickets}
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
    </div>
  );
};

export default Index;
