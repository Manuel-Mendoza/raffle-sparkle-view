import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trophy, DollarSign, Users, Plus } from "lucide-react";
import { raffleService, Raffle } from "@/services/raffle";
import { AxiosErrorResponse } from "@/types/api";

export const RaffleManager = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    ticketPrice: 0,
    endDate: "",
  });

  useEffect(() => {
    loadRaffles();
  }, []);

  const loadRaffles = async () => {
    try {
      setIsLoading(true);
      const currentRaffle = await raffleService.getCurrentRaffle();
      setRaffles([currentRaffle]);
    } catch (error) {
      console.error("Error loading current raffle:", error);
      setRaffles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      prize: "",
      ticketPrice: 0,
      endDate: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ticketPrice" ? Number(value) : value,
    }));
  };

  const handleCreateRaffle = async () => {
    // Verificar token antes de crear
    const token = localStorage.getItem("token");
    console.log("Token disponible para crear rifa:", token ? "SÍ" : "NO");
    if (token) {
      console.log("Token (primeros 20 chars):", token.substring(0, 20) + "...");
    }

    if (!formData.title.trim()) {
      alert("El título es requerido");
      return;
    }

    if (!formData.description.trim()) {
      alert("La descripción es requerida");
      return;
    }

    if (!formData.prize.trim()) {
      alert("El premio es requerido");
      return;
    }

    if (!formData.ticketPrice || formData.ticketPrice <= 0) {
      alert("El precio del ticket debe ser mayor a 0");
      return;
    }

    if (!formData.endDate) {
      alert("La fecha de fin es requerida");
      return;
    }

    try {
      setIsCreating(true);
      const raffleData = { ...formData, totalTickets: 10000 };
      console.log("Enviando datos:", raffleData);
      await raffleService.createRaffle(raffleData);
      await loadRaffles();
      resetForm();
      setIsCreateModalOpen(false);
      alert("¡Rifa creada exitosamente!");
    } catch (error: unknown) {
      console.error("Error creating raffle:", error);
      const axiosError = error as AxiosErrorResponse;
      if (axiosError.response?.status === 404) {
        alert(
          "Endpoint no encontrado - Verifica que el backend esté corriendo"
        );
      } else if (axiosError.response?.status === 401) {
        alert("Token de autenticación inválido o expirado");
      } else {
        alert(
          "Error al crear la rifa: " +
            (axiosError.response?.data?.error || axiosError.message)
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 border-green-200"
      >
        Activa
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-800 border-gray-200"
      >
        Inactiva
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary">
            Gestión de Rifas
          </h2>
          <p className="text-accent">
            Administra y controla las rifas del sistema
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Rifa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Rifa</DialogTitle>
              <DialogDescription>
                Completa la información para crear una nueva rifa
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Título de la rifa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize">Premio *</Label>
                <Input
                  id="prize"
                  name="prize"
                  value={formData.prize}
                  onChange={handleInputChange}
                  placeholder="Premio a sortear"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Precio del Ticket *</Label>
                <Input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  placeholder="Precio en pesos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el premio y la rifa..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateRaffle}
                disabled={isCreating}
                className="bg-primary hover:bg-primary/90"
              >
                {isCreating ? "Creando..." : "Crear Rifa"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Raffles Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : raffles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-accent">No hay rifa activa en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {raffles.map((raffle) => {
            const soldPercentage = Math.round(
              (raffle.soldTickets / raffle.totalTickets) * 100
            );
            const totalRevenue = raffle.soldTickets * raffle.ticketPrice;

            return (
              <Card
                key={raffle.id}
                className="border-2 border-primary/20 hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-secondary truncate">
                      {raffle.title}
                    </CardTitle>
                    {getStatusBadge(raffle.status)}
                  </div>
                  <CardDescription className="text-sm">
                    {raffle.description || "Sin descripción disponible"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prize Info */}
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-medium text-secondary">
                      {raffle.prize}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-secondary/5 rounded">
                      <DollarSign className="w-4 h-4 mx-auto text-secondary mb-1" />
                      <p className="text-sm font-medium text-secondary">
                        ${raffle.ticketPrice}
                      </p>
                      <p className="text-xs text-accent">por ticket</p>
                    </div>
                    <div className="text-center p-2 bg-accent/5 rounded">
                      <Users className="w-4 h-4 mx-auto text-accent mb-1" />
                      <p className="text-sm font-medium text-secondary">
                        {raffle.soldTickets}/{raffle.totalTickets}
                      </p>
                      <p className="text-xs text-accent">vendidos</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-accent">Progreso</span>
                      <span className="text-secondary font-medium">
                        {soldPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all"
                        style={{ width: `${soldPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-accent">
                      Total recaudado: ${totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
