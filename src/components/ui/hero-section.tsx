import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-motorcycle.jpg";
import type { Raffle } from "@/services/raffle";
import type { TopCustomerResponse } from "@/services/statistics";

interface HeroSectionProps {
  raffleData?: Raffle | null;
  topCustomer?: TopCustomerResponse | null;
  onVerifyTickets?: () => void;
}

export function HeroSection({
  raffleData,
  topCustomer,
  onVerifyTickets,
}: HeroSectionProps) {
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

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
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
                ${raffleData.ticketPrice}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm opacity-80">
                Disponible
              </p>
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
