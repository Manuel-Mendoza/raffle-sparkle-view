import { Badge } from "@/components/ui/base/badge";
import { Button } from "@/components/ui/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { RefreshCw, Trophy, Medal, Award } from "lucide-react";
import type { WinnerResponse } from "@/services/admin";

interface IndividualWinners {
  first: WinnerResponse | null;
  second: WinnerResponse | null;
  third: WinnerResponse | null;
}

interface IndividualWinnersProps {
  winners: IndividualWinners;
  loading?: boolean;
  onRefresh?: () => void;
  raffleTitle?: string;
}

export function IndividualWinners({
  winners,
  loading = false,
  onRefresh,
  raffleTitle,
}: IndividualWinnersProps) {
  const places = [
    {
      position: 1,
      title: "Primer Lugar",
      icon: Trophy,
      winner: winners.first,
      colors: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        text: "text-yellow-600",
        badge: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      },
      emoji: "🥇",
    },
    {
      position: 2,
      title: "Segundo Lugar",
      icon: Medal,
      winner: winners.second,
      colors: {
        bg: "bg-gray-400/10",
        border: "border-gray-400/30",
        text: "text-gray-600",
        badge: "bg-gray-400/20 text-gray-700 border-gray-400/30",
      },
      emoji: "🥈",
    },
    {
      position: 3,
      title: "Tercer Lugar",
      icon: Award,
      winner: winners.third,
      colors: {
        bg: "bg-amber-600/10",
        border: "border-amber-600/30",
        text: "text-amber-700",
        badge: "bg-amber-600/20 text-amber-800 border-amber-600/30",
      },
      emoji: "🥉",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          🏆 Ganadores {raffleTitle && `- ${raffleTitle}`}
        </h2>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="mb-4"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        )}
      </div>

      {/* Winners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {places.map((place) => {
          const Icon = place.icon;
          
          return (
            <Card
              key={place.position}
              className={`${place.colors.bg} ${place.colors.border} border-2 transition-all duration-300 hover:shadow-lg ${
                loading ? 'opacity-50' : ''
              }`}
            >
              <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-center mb-2">
                  <Icon className={`w-6 h-6 ${place.colors.text} mr-2`} />
                  <span className="text-2xl">{place.emoji}</span>
                </div>
                <CardTitle className={`text-lg ${place.colors.text}`}>
                  {place.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                {place.winner ? (
                  <div className="space-y-3">
                    <Badge className={`${place.colors.badge} font-semibold px-3 py-1`}>
                      Ticket {place.winner.ticketNumber.padStart(4, "0")}
                    </Badge>
                    
                    <div>
                      <p className="font-bold text-foreground text-lg">
                        {place.winner.customerName}
                      </p>
                      {place.winner.customerEmail && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {place.winner.customerEmail}
                        </p>
                      )}
                    </div>
                    
                    {place.winner.drawnAt && (
                      <p className="text-xs text-muted-foreground">
                        Sorteado: {new Date(place.winner.drawnAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Badge variant="secondary" className="font-semibold px-3 py-1">
                      Por anunciar
                    </Badge>
                    <p className="text-muted-foreground">
                      Ganador aún no declarado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Ganadores declarados: {
            [winners.first, winners.second, winners.third].filter(Boolean).length
          } de 3
        </p>
      </div>
    </div>
  );
}
