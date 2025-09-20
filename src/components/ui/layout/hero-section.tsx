import { Badge } from "@/components/ui/base/badge";
import { Button } from "@/components/ui/base/button";
import { OptimizedImage } from "@/components/ui/base/optimized-image";
import { ShoppingCart, Search } from "lucide-react";
import type { Raffle } from "@/services/raffle";
import type { TopCustomerResponse } from "@/services/statistics";
import type { WinnerResponse } from "@/services/admin";
import { formatBsV } from "@/lib/currency";

interface LastWinner {
  raffleImage?: string;
  customerName: string;
  ticketNumber: string;
  prize: string;
  raffleTitle: string;
  drawnAt: string;
}

interface HeroSectionProps {
  raffleData?: Raffle | null;
  topCustomer?: TopCustomerResponse | null;
  lastWinner?: LastWinner | null;
  winners?: WinnerResponse[] | null;
  onVerifyTickets?: () => void;
  onBuyTicket?: () => void;
  onViewPrize?: () => void;
}

export function HeroSection({
  raffleData,
  topCustomer,
  lastWinner,
  winners,
  onVerifyTickets,
  onBuyTicket,
  onViewPrize,
}: HeroSectionProps) {
  console.log("HeroSection props:", { raffleData, lastWinner, topCustomer });

  // Si no hay rifa activa pero hay último ganador, mostrar ganador
  if (!raffleData && lastWinner) {
    console.log("Showing last winner section with data:", lastWinner);

    // Usar imagen de la rifa del ganador o placeholder
    const backgroundImage = lastWinner.raffleImage || "/placeholder.svg";

    return (
      <div className="relative min-h-[600px] p-4 flex items-center justify-center overflow-hidden rounded-xl">
        {/* Background Image */}
        <OptimizedImage
          src={backgroundImage}
          alt="Último ganador"
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
        />

        {/* Overlay con gradiente consistente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-accent/85 to-secondary/80" />

        {/* Elementos decorativos consistentes */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-8 left-8 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-pulse delay-1000" />

        <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-4">
          {/* Header con estilo consistente */}
          <Badge className="mb-6 bg-accent/20 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm text-lg px-4 py-2">
            🏆 GANADOR
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground">
            ¡Felicidades!
          </h1>

          {/* Card principal con estilo consistente */}
          <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-6 border border-primary-foreground/20 shadow-card">
            {/* Nombre del ganador destacado */}
            <div className="inline-block bg-gradient-to-r from-primary to-primary/80 px-6 py-3 rounded-lg shadow-glow mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                {lastWinner.customerName}
              </h2>
            </div>

            {/* Grid de información con estilo consistente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20">
                <p className="text-sm opacity-80 mb-1 text-primary-foreground/80">
                  🎫 Ticket Ganador
                </p>
                <p className="text-xl font-bold text-primary">
                  {lastWinner.ticketNumber.padStart(4, "0")}
                </p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20">
                <p className="text-sm opacity-80 mb-1 text-primary-foreground/80">
                  🏆 Premio
                </p>
                <p className="text-xl font-bold text-primary">
                  {lastWinner.prize}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-primary-foreground/5 rounded-lg p-4">
                <p className="text-sm opacity-80 mb-1 text-primary-foreground/80">
                  🎲 Rifa
                </p>
                <p className="text-lg font-semibold text-primary-foreground">
                  {lastWinner.raffleTitle}
                </p>
              </div>
            </div>

            {/* Fecha con estilo consistente */}
            <div className="mt-6 pt-4 border-t border-primary-foreground/20">
              <p className="text-sm opacity-80 text-primary-foreground/80">
                📅 Fecha del Sorteo
              </p>
              <p className="text-lg font-semibold text-primary-foreground">
                {new Date(lastWinner.drawnAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Mensaje final con estilo consistente */}
          <div className="bg-accent/10 backdrop-blur-sm rounded-lg p-4 border border-accent/20">
            <p className="text-lg font-medium text-primary-foreground mb-2">
              ¡Mantente atento a nuestras próximas rifas!
            </p>
            <p className="text-base opacity-90 text-primary-foreground/80">
              Tu también puedes ser el próximo ganador
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

  const backgroundImage = raffleData.image || "/placeholder.svg";

  // Detectar si hay ganadores para mostrar vista especial
  const hasWinners = winners && winners.length > 0;

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      <OptimizedImage
        src={backgroundImage}
        alt={raffleData.title}
        className="absolute inset-0 w-full h-full object-cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-12">
        {hasWinners ? (
          // Vista de ganadores
          <>
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-400/30 backdrop-blur-sm">
              🏆 ¡RIFA FINALIZADA! 🏆
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              🎊 ¡Felicidades a los Ganadores! 🎊
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              {raffleData.title} - Sorteo finalizado
            </p>

            {/* Badges de ganadores - Solo mostrar los que ya han sido declarados */}
            <div className="space-y-4 mb-8">
              {/* Mostrar todos los lugares (1, 2, 3) */}
              {Array.from({ length: 3 }, (_, i) => {
                const position = i + 1;
                const winner = winners.find((w) => w.position === position);
                const places = ["🥇 1er Lugar", "🥈 2do Lugar", "🥉 3er Lugar"];
                const colors = [
                  "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
                  "bg-gray-400/20 text-gray-300 border-gray-400/30",
                  "bg-amber-600/20 text-amber-300 border-amber-500/30",
                ];

                if (winner) {
                  // Mostrar ganador declarado
                  return (
                    <Badge
                      key={`winner-${position}`}
                      className={`${colors[i]} backdrop-blur-sm text-lg px-6 py-3 font-semibold block`}
                    >
                      {places[i]}: {winner.customerName} - Ticket{" "}
                      {winner.ticketNumber.padStart(4, "0")}
                    </Badge>
                  );
                } else {
                  // Mostrar placeholder
                  return (
                    <Badge
                      key={`placeholder-${position}`}
                      className="bg-gray-600/20 text-gray-400 border-gray-500/30 backdrop-blur-sm text-lg px-6 py-3 font-semibold block"
                    >
                      {places[i]}: Por anunciar...
                    </Badge>
                  );
                }
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onViewPrize}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                🏆 Ver Premios
              </Button>
            </div>
          </>
        ) : (
          // Vista normal de rifa activa
          <>
            <Badge className="mb-4 bg-accent/20 text-primary border-primary/30 backdrop-blur-sm hover:bg-accent">
              {raffleData.status === "active"
                ? "¡RIFA ACTIVA!"
                : "¡RIFA ESPECIAL!"}
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              🎉 {raffleData.title} 🎉
            </h1>

            <div className="space-y-3 mb-6">
              {/* Separar premios y mostrar con emojis de medallas */}
              {raffleData.prize.split(",").map((prize, index) => {
                const trimmedPrize = prize.trim();
                let emoji = "";
                let bgColor = "";
                const textColor = "text-primary-foreground";

                if (index === 0) {
                  emoji = "🥇";
                  bgColor = "from-yellow-500 to-yellow-600";
                } else if (index === 1) {
                  emoji = "🥈";
                  bgColor = "from-gray-400 to-gray-500";
                } else if (index === 2) {
                  emoji = "🥉";
                  bgColor = "from-amber-600 to-amber-700";
                } else {
                  emoji = "🏆";
                  bgColor = "from-primary to-primary/80";
                }

                return (
                  <div
                    key={index}
                    className={`inline-block bg-gradient-to-r ${bgColor} px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-glow mx-1 mb-2`}
                  >
                    <h2
                      className={`text-lg sm:text-xl md:text-2xl font-bold ${textColor}`}
                    >
                      {emoji} {index + 1}° Lugar: {trimmedPrize}
                    </h2>
                  </div>
                );
              })}
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-primary-foreground mb-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm opacity-80">
                    Precio por ticket
                  </p>
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

              <div className="mt-4">
                <div className="flex justify-between text-sm text-primary-foreground/80 mb-1">
                  <span>Vendido: {progressPercentage.toFixed(1)}%</span>
                  <span>
                    Disponible: {(100 - progressPercentage).toFixed(1)}%
                  </span>
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
                onClick={onViewPrize}
                variant="outline"
                size="lg"
                className="border-2 border-accent/50 text-accent hover:bg-accent/10 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8"
              >
                🏆 Ver Premio
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
          </>
        )}
      </div>

      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-8 left-8 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-pulse delay-1000" />
    </div>
  );
}
