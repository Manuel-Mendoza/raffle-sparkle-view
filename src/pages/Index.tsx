import { HeroSection } from "@/components/ui/hero-section";
import { RaffleCard } from "@/components/ui/raffle-card";
import { PurchaseSteps } from "@/components/ui/purchase-steps";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/favico.png";

const Index = () => {
  const raffleData = {
    title: "Rifa Especial Mantequilla 1000",
    totalTickets: 1000,
    soldTickets: 0,
    price: 2.25,
    prizes: [
      { position: "🏆 Gran Premio", prize: "Moto Deportiva 🏍️", icon: "🏍️" },
    ],
    date: "30 de Diciembre",
    time: "8:00 PM",
    features: [
      "Sorteo transparente en vivo",
      "Premio único garantizado",
      "Transmisión en directo",
    ],
  };

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/593978907442", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary to-secondary/90 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-12 h-12" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">
                Rifas.queMantequilla
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleWhatsAppContact}
                className="bg-accent hover:bg-accent/90 text-secondary"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contáctanos
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSection />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Raffle Info */}
          <div className="lg:col-span-1">
            <RaffleCard {...raffleData} />
          </div>

          {/* Right Column - Purchase Steps */}
          <div className="lg:col-span-2">
            <PurchaseSteps raffleData={raffleData} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent">
            ¿Necesitas ayuda?
            <Button
              className="text-primary hover:text-primary/80 p-0 ml-2"
              onClick={handleWhatsAppContact}
            >
              Chatea con nosotros
            </Button>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
