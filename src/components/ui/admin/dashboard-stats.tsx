import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import {
  statisticsService,
  type DashboardStatistics,
} from "@/services/statistics";
import { toast } from "sonner";
import { formatBsV } from "@/lib/currency";

export const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast.error("Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-accent">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-accent">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

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
              {formatBsV(stats.totalSales)}
            </div>
            <p className="text-xs text-accent flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Rifa actual
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Vendido
            </CardTitle>
            <Ticket className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stats.soldPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-accent">
              {stats.ticketsSold} tickets vendidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Disponible
            </CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {(100 - stats.soldPercentage).toFixed(1)}%
            </div>
            <p className="text-xs text-accent">
              {stats.remainingTickets} tickets restantes
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
            {stats.topCustomer ? (
              <>
                <div className="text-lg font-bold text-secondary">
                  {stats.topCustomer.customer.name}
                </div>
                <p className="text-xs text-accent">
                  {stats.topCustomer.totalTickets} tickets comprados
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-secondary">
                  Sin datos
                </div>
                <p className="text-xs text-accent">
                  No hay compras registradas
                </p>
              </>
            )}
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
          <CardDescription>
            {stats.currentRaffle?.title} - {stats.currentRaffle?.prize}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary">
                Vendido: {stats.soldPercentage.toFixed(1)}%
              </span>
              <span className="text-sm text-accent">
                Disponible: {(100 - stats.soldPercentage).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-secondary/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.soldPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-primary border-primary">
                {stats.soldPercentage}% Completado
              </Badge>
              <span className="text-sm text-accent">
                ${stats.totalSales.toLocaleString()} recaudado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Raffle Info */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-secondary">
            <Calendar className="h-5 w-5 text-primary" />
            Información de la Rifa Actual
          </CardTitle>
          <CardDescription>Detalles de la rifa en curso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-semibold text-secondary mb-2">Título</h4>
              <p className="text-accent">{stats.currentRaffle?.title}</p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg">
              <h4 className="font-semibold text-secondary mb-2">Premio</h4>
              <p className="text-accent">{stats.currentRaffle?.prize}</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg">
              <h4 className="font-semibold text-secondary mb-2">
                Fecha de Cierre
              </h4>
              <p className="text-accent">
                {stats.currentRaffle?.endDate
                  ? new Date(stats.currentRaffle.endDate).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "No definida"}
              </p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-secondary mb-2">
                Total Posible
              </h4>
              <p className="text-accent font-bold">
                {formatBsV(
                  stats.totalTickets * (stats.currentRaffle?.ticketPrice || 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
