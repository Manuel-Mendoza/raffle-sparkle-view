import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Calendar, Trophy, DollarSign, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Raffle {
  id: number;
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  status: "active" | "finished" | "draft";
  startDate: string;
  endDate: string;
  image: string;
}

// Datos simulados de rifas
const mockRaffles: Raffle[] = [
  {
    id: 1,
    title: "Moto Deportiva 2024",
    description: "Increíble moto deportiva modelo 2024, completamente nueva",
    prize: "Moto Deportiva Yamaha R15",
    ticketPrice: 50,
    totalTickets: 500,
    soldTickets: 247,
    status: "active" as const,
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    image: "/src/assets/hero-motorcycle.jpg"
  }
];

export const RaffleManager = () => {
  const [raffles, setRaffles] = useState<Raffle[]>(mockRaffles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<Raffle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    ticketPrice: 0,
    totalTickets: 0,
    startDate: "",
    endDate: "",
    image: ""
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      prize: "",
      ticketPrice: 0,
      totalTickets: 0,
      startDate: "",
      endDate: "",
      image: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "ticketPrice" || name === "totalTickets" ? Number(value) : value
    }));
  };

  const handleCreateRaffle = () => {
    if (!formData.title || !formData.prize || !formData.ticketPrice || !formData.totalTickets) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const newRaffle: Raffle = {
      id: Date.now(),
      ...formData,
      soldTickets: 0,
      status: "draft"
    };

    setRaffles(prev => [...prev, newRaffle]);
    resetForm();
    setIsCreateModalOpen(false);
    toast({
      title: "¡Rifa creada!",
      description: "La nueva rifa ha sido creada exitosamente",
    });
  };

  const handleEditRaffle = () => {
    if (!editingRaffle) return;

    setRaffles(prev => 
      prev.map(raffle => 
        raffle.id === editingRaffle.id 
          ? { ...raffle, ...formData }
          : raffle
      )
    );
    
    resetForm();
    setEditingRaffle(null);
    toast({
      title: "¡Rifa actualizada!",
      description: "Los cambios han sido guardados exitosamente",
    });
  };

  const handleDeleteRaffle = (id: number) => {
    setRaffles(prev => prev.filter(raffle => raffle.id !== id));
    toast({
      title: "Rifa eliminada",
      description: "La rifa ha sido eliminada del sistema",
    });
  };

  const openEditModal = (raffle: Raffle) => {
    setEditingRaffle(raffle);
    setFormData({
      title: raffle.title,
      description: raffle.description,
      prize: raffle.prize,
      ticketPrice: raffle.ticketPrice,
      totalTickets: raffle.totalTickets,
      startDate: raffle.startDate,
      endDate: raffle.endDate,
      image: raffle.image
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activa", className: "bg-green-100 text-green-800 border-green-200" },
      finished: { label: "Finalizada", className: "bg-gray-100 text-gray-800 border-gray-200" },
      draft: { label: "Borrador", className: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Gestión de Rifas</h2>
          <p className="text-accent">Administra y controla todas las rifas del sistema</p>
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
                <Label htmlFor="totalTickets">Total de Tickets *</Label>
                <Input
                  id="totalTickets"
                  name="totalTickets"
                  type="number"
                  value={formData.totalTickets}
                  onChange={handleInputChange}
                  placeholder="Cantidad total"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin</Label>
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
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateRaffle} className="bg-primary hover:bg-primary/90">
                Crear Rifa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Raffles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {raffles.map((raffle) => {
          const soldPercentage = Math.round((raffle.soldTickets / raffle.totalTickets) * 100);
          const totalRevenue = raffle.soldTickets * raffle.ticketPrice;
          
          return (
            <Card key={raffle.id} className="border-2 border-primary/20 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-secondary truncate">{raffle.title}</CardTitle>
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
                  <span className="font-medium text-secondary">{raffle.prize}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-secondary/5 rounded">
                    <DollarSign className="w-4 h-4 mx-auto text-secondary mb-1" />
                    <p className="text-sm font-medium text-secondary">${raffle.ticketPrice}</p>
                    <p className="text-xs text-accent">por ticket</p>
                  </div>
                  <div className="text-center p-2 bg-accent/5 rounded">
                    <Users className="w-4 h-4 mx-auto text-accent mb-1" />
                    <p className="text-sm font-medium text-secondary">{raffle.soldTickets}/{raffle.totalTickets}</p>
                    <p className="text-xs text-accent">vendidos</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-accent">Progreso</span>
                    <span className="text-secondary font-medium">{soldPercentage}%</span>
                  </div>
                  <div className="w-full bg-secondary/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all"
                      style={{ width: `${soldPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-accent">Total recaudado: ${totalRevenue.toLocaleString()}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(raffle)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteRaffle(raffle.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingRaffle} onOpenChange={() => setEditingRaffle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Rifa</DialogTitle>
            <DialogDescription>
              Modifica la información de la rifa seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prize">Premio *</Label>
              <Input
                id="edit-prize"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ticketPrice">Precio del Ticket *</Label>
              <Input
                id="edit-ticketPrice"
                name="ticketPrice"
                type="number"
                value={formData.ticketPrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-totalTickets">Total de Tickets *</Label>
              <Input
                id="edit-totalTickets"
                name="totalTickets"
                type="number"
                value={formData.totalTickets}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Fecha de Inicio</Label>
              <Input
                id="edit-startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">Fecha de Fin</Label>
              <Input
                id="edit-endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingRaffle(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditRaffle} className="bg-primary hover:bg-primary/90">
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};