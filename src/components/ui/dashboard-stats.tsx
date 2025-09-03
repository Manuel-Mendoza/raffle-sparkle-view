import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trophy,
  DollarSign,
  Ticket,
  TrendingUp,
  Calendar,
  Star,
  Award,
} from "lucide-react";

// Datos simulados
const mockData = {
  totalSales: 15450,
  ticketsSold: 247,
  totalTickets: 500,
  topBuyer: {
    name: "María González",
    tickets: 15,
    total: 750,
  },
  recentSales: [
    { id: 1, buyer: "Juan Pérez", tickets: 5, amount: 250, date: "2024-01-15" },
    { id: 2, buyer: "Ana Silva", tickets: 8, amount: 400, date: "2024-01-15" },
    {
      id: 3,
      buyer: "Carlos Ruiz",
      tickets: 3,
      amount: 150,
      date: "2024-01-14",
    },
    {
      id: 4,
      buyer: "Lucia Torres",
      tickets: 12,
      amount: 600,
      date: "2024-01-14",
    },
    {
      id: 5,
      buyer: "Roberto Díaz",
      tickets: 2,
      amount: 100,
      date: "2024-01-13",
    },
  ],
  dailyStats: [
    { date: "15 Ene", sales: 1250, tickets: 25 },
    { date: "14 Ene", sales: 2100, tickets: 42 },
    { date: "13 Ene", sales: 800, tickets: 16 },
    { date: "12 Ene", sales: 1500, tickets: 30 },
    { date: "11 Ene", sales: 950, tickets: 19 },
  ],
};

export const DashboardStats = () => {
  const soldPercentage = Math.round(
    (mockData.ticketsSold / mockData.totalTickets) * 100
  );
  const remainingTickets = mockData.totalTickets - mockData.ticketsSold;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Total Recaudado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              ${mockData.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-accent flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% desde ayer
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Tickets Vendidos
            </CardTitle>
            <Ticket className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {mockData.ticketsSold}
            </div>
            <p className="text-xs text-accent">
              de {mockData.totalTickets} disponibles ({soldPercentage}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Tickets Restantes
            </CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {remainingTickets}
            </div>
            <p className="text-xs text-accent">
              {100 - soldPercentage}% disponible
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Mayor Comprador
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">
              {mockData.topBuyer.name}
            </div>
            <p className="text-xs text-accent">
              {mockData.topBuyer.tickets} tickets - ${mockData.topBuyer.total}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-secondary">
            <Trophy className="h-5 w-5 text-primary" />
            Progreso de la Rifa
          </CardTitle>
          <CardDescription>Estado actual de las ventas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary">
                Vendidos: {mockData.ticketsSold}
              </span>
              <span className="text-sm text-accent">
                Restantes: {remainingTickets}
              </span>
            </div>
            <div className="w-full bg-secondary/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-primary border-primary">
                {soldPercentage}% Completado
              </Badge>
              <span className="text-sm text-accent">
                ${mockData.totalSales.toLocaleString()} recaudado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales & Daily Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Calendar className="h-5 w-5 text-primary" />
              Ventas Recientes
            </CardTitle>
            <CardDescription>Últimas transacciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 bg-primary/5 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-secondary">{sale.buyer}</p>
                    <p className="text-sm text-accent">{sale.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary">${sale.amount}</p>
                    <p className="text-sm text-accent">
                      {sale.tickets} tickets
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Stats */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estadísticas Diarias
            </CardTitle>
            <CardDescription>Rendimiento de los últimos 5 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.dailyStats.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-secondary">{day.date}</p>
                    <p className="text-sm text-accent">
                      {day.tickets} tickets vendidos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary">
                      ${day.sales.toLocaleString()}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        index === 0
                          ? "border-primary text-primary"
                          : "border-accent/30 text-accent"
                      }
                    >
                      {index === 0 ? "Hoy" : "Histórico"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
