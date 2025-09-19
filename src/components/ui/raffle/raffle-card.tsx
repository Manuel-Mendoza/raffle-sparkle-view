import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Trophy, Users } from "lucide-react";

interface RaffleCardProps {
  title: string;
  totalTickets: number;
  soldTickets: number;
  prizes: { position: string; prize: string; icon: string }[];
  date: string;
  time: string;
  features: string[];
  className?: string;
}

export function RaffleCard({
  title,
  totalTickets,
  soldTickets,
  prizes,
  date,
  time,
  features,
  className,
}: RaffleCardProps) {
  const progress = (soldTickets / totalTickets) * 100;

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-card",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20"
          >
            <CalendarDays className="w-3 h-3 mr-1" />
            {date}
          </Badge>
          <Badge variant="outline" className="border-accent text-accent">
            <Clock className="w-3 h-3 mr-1" />
            {time}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold text-secondary">{title}</h2>
        <p className="text-accent font-medium">
          {(100 - progress).toFixed(1)}% Disponible
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Vendido: {progress.toFixed(1)}%
            </span>
            <span className="text-accent font-medium">
              Disponible: {(100 - progress).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Single Prize */}
        <div className="space-y-3">
          <h3 className="font-semibold text-secondary flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-primary" />
            Premio Único
          </h3>
          <div className="flex items-center justify-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="text-center">
              <p className="font-bold text-lg text-primary">🏆 GRAN PREMIO</p>
              <p className="text-xl font-semibold text-secondary">
                {prizes[0]?.prize}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
