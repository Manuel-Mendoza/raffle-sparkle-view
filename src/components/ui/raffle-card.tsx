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
  className
}: RaffleCardProps) {
  const progress = (soldTickets / totalTickets) * 100;

  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-card",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <CalendarDays className="w-3 h-3 mr-1" />
            {date}
          </Badge>
          <Badge variant="outline" className="border-accent text-accent">
            <Clock className="w-3 h-3 mr-1" />
            {time}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold text-secondary">{title}</h2>
        <p className="text-accent font-medium">{totalTickets.toLocaleString()} Boletos Disponibles</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vendidos: {soldTickets}</span>
            <span className="text-accent font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Prizes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-secondary flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-primary" />
            Premios
          </h3>
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-accent/5">
              <span className="text-xl">{prize.icon}</span>
              <span className="font-medium text-accent">{prize.position}:</span>
              <span className="text-secondary">{prize.prize}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-secondary">Características</h4>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-accent">{feature}</span>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="border-t border-accent/10 pt-4">
          <h4 className="font-semibold text-secondary mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            ¿Cómo funciona? 🍀
          </h4>
          <div className="space-y-2 text-sm text-accent">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
              <span>Se eligen los boletos 🎟️</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
              <span>Se llenan los datos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
              <span>Se realiza el registro</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}