import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Users,
  Trophy,
  DollarSign,
  Ticket,
  Edit,
  Trash2,
  Plus,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardStats } from "@/components/ui/dashboard-stats";
import { RaffleManager } from "@/components/ui/raffle-manager";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");

    if (!auth || role !== "admin") {
      navigate("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel administrativo",
    });
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-secondary">
              Rifas q' Mantequilla
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Panel Admin
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-accent">¡Bienvenido, Admin!</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-secondary hover:text-primary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-accent">
            Gestiona rifas, visualiza estadísticas y administra el sistema
          </p>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 border border-primary/20">
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
