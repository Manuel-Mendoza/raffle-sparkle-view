import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base/tabs";
import { Badge } from "@/components/ui/base/badge";
import {
  LogOut,
  Users,
  Trophy,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Eye,
} from "lucide-react";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { DashboardStats } from "@/components/ui/admin/dashboard-stats";
import { RaffleManager } from "@/components/ui/admin/raffle-manager";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Dashboard Administrativo
            </h1>
            <p className="text-accent">
              Gestiona rifas, visualiza estadísticas y administra el sistema
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-secondary hover:text-primary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-lg bg-white/50 border border-primary/20">
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger
              value="raffles"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Gestionar Rifas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="raffles" className="space-y-6">
            <RaffleManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
