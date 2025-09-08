import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Trophy, User, Phone, Calendar, Hash } from "lucide-react";
import heroImage from "@/assets/hero-motorcycle.jpg";
import type { Raffle } from "@/services/raffle";
import type { TopCustomerResponse, Winner } from "@/services/statistics";
import { formatBsV } from "@/lib/currency";

interface HeroSectionProps {
  raffleData?: Raffle | null;
  topCustomer?: TopCustomerResponse | null;
  lastWinner?: Winner | null;
  onVerifyTickets?: () => void;
  onBuyTicket?: () => void;
}

export function HeroSection({
  raffleData,
  topCustomer,
  lastWinner,
  onVerifyTickets,
  onBuyTicket,
}: HeroSectionProps) {
  // Si no hay rifa activa pero hay último ganador, mostrar ganador
  if (!raffleData && lastWinner) {
    return (
      <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-accent/85 to-secondary/80" />
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-12 left-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-24 h-24 bg-primary/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-12 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg animate-pulse delay-500" />
        
        <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-6 py-8">
          {/* Header con trofeo */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-400/20 p-6 rounded-full border-4 border-yellow-400/30 animate-pulse">
                <Trophy className="w-16 h-16 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              ¡GANADOR!
            </h1>
            <p className="text-xl opacity-90">Felicitaciones al afortunado ganador</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
            {/* Información del ganador */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-accent/20 p-3 rounded-full">
                  <User className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
                {lastWinner.customerName}
              </h2>
              
              {/* Ticket ganador destacado */}
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-6 py-3 rounded-xl shadow-lg mb-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-6 h-6" />
                  <span className="text-2xl font-bold">TICKET {lastWinner.ticketNumber}</span>
                </div>
              </div>
              
              {/* Teléfono */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-lg">{lastWinner.customerPhone}</span>
              </div>
            </div>

            {/* Premio destacado */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6 mb-8 border border-accent/30">
              <div className="flex justify-center mb-3">
                <Trophy className="w-8 h-8 text-yellow-300" />
              </div>
              <p className="text-sm opacity-80 mb-2 uppercase tracking-wide">Premio Ganado</p>
              <h3 className="text-3xl md:text-4xl font-bold text-yellow-300">
                {lastWinner.prize}
              </h3>
            </div>

            {/* Detalles de la rifa en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm opacity-80 mb-2 uppercase tracking-wide">Rifa</p>
                <p className="text-xl font-semibold">{lastWinner.raffleTitle}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-accent/20 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-sm opacity-80 mb-2 uppercase tracking-wide">Fecha del Sorteo</p>
                <p className="text-xl font-semibold">
                  {new Date(lastWinner.drawnAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Mensaje final */}
          <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-xl font-semibold mb-2 text-accent">
              ¡Mantente atento a nuestras próximas rifas!
            </p>
            <p className="text-lg opacity-80">
              Tú también puedes ser el próximo ganador
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!raffleData) {
    return (
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/70" />
        <div className="relative z-10 text-center text-primary-foreground">
          <p className="text-xl">Cargando información de la rifa...</p>
        </div>
      </div>
    );
  }

  const availableTickets = raffleData.totalTickets - raffleData.soldTickets;
  const progressPercentage =
    (raffleData.soldTickets / raffleData.totalTickets) * 100;

  // Use raffle image if available, otherwise use default hero image
  const backgroundImage = raffleData.image || heroImage;

  // Debug: Log the image being used
  console.log("Raffle image from API:", raffleData.image);
  console.log("Background image being used:", backgroundImage);

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-12">
        <Badge className="mb-4 bg-accent/20 text-primary border-primary/30 backdrop-blur-sm hover:bg-accent">
          {raffleData.status === "active" ? "¡RIFA ACTIVA!" : "¡RIFA ESPECIAL!"}
        </Badge>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
          {raffleData.title}
        </h1>

        <div className="inline-block bg-gradient-to-r from-primary to-primary/80 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-glow mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground">
            🏆 {raffleData.prize}
          </h2>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 text-primary-foreground mb-4">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm opacity-80">Precio por ticket</p>
              <p className="text-lg sm:text-2xl font-bold">
                {formatBsV(raffleData.ticketPrice)}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm opacity-80">Disponible</p>
              <p className="text-lg sm:text-2xl font-bold text-accent">
                {(100 - progressPercentage).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Top Customer Info */}
          {topCustomer && (
            <div className="border-t border-white/20 pt-3 sm:pt-4 mb-3 sm:mb-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm opacity-80 text-primary-foreground">
                  🏅 Mayor comprador
                </p>
                <p className="text-base sm:text-lg font-bold text-accent">
                  {topCustomer.customer.name}
                </p>
                <p className="text-xs sm:text-sm text-primary-foreground/80">
                  {topCustomer.totalTickets} tickets
                </p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-primary-foreground/80 mb-1">
              <span>Vendido: {progressPercentage.toFixed(1)}%</span>
              <span>Disponible: {(100 - progressPercentage).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-base sm:text-lg text-primary-foreground/90 mb-4 sm:mb-6 font-medium px-2 sm:px-0">
          {raffleData.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
          <Button
            onClick={onBuyTicket}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow transition-all duration-300 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Comprar Ticket
          </Button>

          <Button
            onClick={onVerifyTickets}
            variant="outline"
            size="lg"
            className="border-2 border-primary-foreground/30 text-primary hover:bg-primary-foreground/10 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8"
          >
            <Search className="w-5 h-5 mr-2" />
            Verificar Tickets
          </Button>
        </div>

        <div className="text-primary-foreground/80">
          <p className="text-sm sm:text-base">
            Sorteo:{" "}
            {new Date(raffleData.endDate).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-8 left-8 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-pulse delay-1000" />
    </div>
  );
}
