import { useState } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { RaffleCard } from "@/components/ui/raffle-card";
import { TicketSelector } from "@/components/ui/ticket-selector";
import { UserForm } from "@/components/ui/user-form";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Index = () => {
  const [selectedTickets, setSelectedTickets] = useState(2);
  const [totalAmount, setTotalAmount] = useState(4.50);

  const raffleData = {
    title: "Demo Rifa de Prueba 1000",
    totalTickets: 1000,
    soldTickets: 0,
    prizes: [
      { position: "🥇 Primer Premio", prize: "Moto 🏍️", icon: "🏍️" },
      { position: "🥈 Segundo Lugar", prize: "iPhone 📱", icon: "📱" },
      { position: "🥉 Tercer Premio", prize: "Efectivo 💴", icon: "💴" }
    ],
    date: "30 de Diciembre",
    time: "8:00 PM",
    features: [
      "Descuentos Activados",
      "Promoción 3x2 Activada",
      "Transmisión en vivo"
    ]
  };

  const handleTicketChange = (tickets: number, total: number) => {
    setSelectedTickets(tickets);
    setTotalAmount(total);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", { ...data, tickets: selectedTickets, total: totalAmount });
    // Here you would typically send the data to your backend
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
                <span className="text-2xl">🎰</span>
              </div>
              <span className="text-2xl font-bold text-primary-foreground">
                Rifas Premium
              </span>
            </div>
            <Button 
              onClick={handleWhatsAppContact}
              className="bg-accent hover:bg-accent/90 text-secondary"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contáctanos
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSection />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Raffle Info */}
          <div className="space-y-8">
            <RaffleCard {...raffleData} />
          </div>

          {/* Right Column - Purchase Form */}
          <div className="space-y-8">
            <TicketSelector
              minTickets={2}
              pricePerTicket={2.25}
              currency="USD"
              onTicketChange={handleTicketChange}
            />
            
            <UserForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent">
            ¿Necesitas ayuda? 
            <Button 
              variant="link" 
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
