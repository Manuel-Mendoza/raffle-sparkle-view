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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinishRaffleModal } from "@/components/ui/finish-raffle-modal";
import { Trophy, DollarSign, Users, Plus, Trophy as TrophyIcon, Upload, Clock, Check, X, Image as ImageIcon, User, Phone, CreditCard } from "lucide-react";
import { raffleService, Raffle } from "@/services/raffle";
import { uploadImageToCloudinary } from "@/services/cloudinary";
import { ticketService } from "@/services/tickets";
import { AxiosErrorResponse, TicketRequest } from "@/types/api";

export const RaffleManager = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [raffleToFinish, setRaffleToFinish] = useState<Raffle | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Ticket requests state
  const [ticketRequests, setTicketRequests] = useState<TicketRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isProcessingTicket, setIsProcessingTicket] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    ticketPrice: 0,
    endDate: "",
    image: "",
  });

  useEffect(() => {
    loadRaffles();
    loadTicketRequests();
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

  const loadTicketRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const requests = await ticketService.getPendingTickets();
      setTicketRequests(requests);
    } catch (error) {
      console.error("Error loading ticket requests:", error);
      setTicketRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      prize: "",
      ticketPrice: 0,
      endDate: "",
      image: "",
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

    if (!formData.image) {
      alert("La imagen es requerida");
      return;
    }

    try {
      setIsCreating(true);
      const raffleData = {
        ...formData,
        totalTickets: 10000,
        startDate: new Date().toISOString()
      };
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
          (axiosError.response?.data?.error || axiosError.message || "Error desconocido")
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleFinishRaffle = async (raffle: Raffle) => {
    setRaffleToFinish(raffle);
    setFinishModalOpen(true);
  };

  const confirmFinishRaffle = async () => {
    if (!raffleToFinish) return;

    try {
      setIsFinishing(true);
      await raffleService.finishRaffle();
      await loadRaffles();
      alert("¡Sorteo realizado exitosamente!");
      setFinishModalOpen(false);
      setRaffleToFinish(null);
    } catch (error) {
      console.error("Error finishing raffle:", error);
      alert("Error al finalizar la rifa");
    } finally {
      setIsFinishing(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleApproveTicket = async (ticketId: string) => {
    try {
      setIsProcessingTicket(ticketId);
      await ticketService.approveTicket(ticketId);
      
      // Update local state to remove the approved ticket from pending list
      setTicketRequests(prev => prev.filter(request => request.id !== ticketId));
      
      alert("Ticket aprobado exitosamente");
    } catch (error) {
      console.error("Error approving ticket:", error);
      alert("Error al aprobar el ticket. Intenta de nuevo.");
    } finally {
      setIsProcessingTicket(null);
    }
  };

  const handleRejectTicket = async (ticketId: string) => {
    try {
      setIsProcessingTicket(ticketId);
      await ticketService.rejectTicket(ticketId);
      
      // Update local state to remove the rejected ticket from pending list
      setTicketRequests(prev => prev.filter(request => request.id !== ticketId));
      
      alert("Ticket rechazado exitosamente");
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      alert("Error al rechazar el ticket. Intenta de nuevo.");
    } finally {
      setIsProcessingTicket(null);
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
            Administración
          </h2>
          <p className="text-accent">
            Gestiona rifas y solicitudes de tickets
          </p>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="raffles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="raffles">Gestión de Rifas</TabsTrigger>
          <TabsTrigger value="tickets" className="relative">
            Solicitudes de Tickets
            {ticketRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {ticketRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Raffles Tab */}
        <TabsContent value="raffles" className="space-y-6">
          <div className="flex justify-end">
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
                      className="resize-none"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label htmlFor="image">Imagen de la Rifa</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploadingImage}
                        className="flex-1"
                      />
                      {isUploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      ) : (
                        <Upload className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
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

                      {/* Actions */}
                      <div className="flex justify-end space-x-2 pt-4 border-t border-accent/10 mt-4">
                        <Button
                          onClick={() => handleFinishRaffle(raffle)}
                          disabled={isFinishing || raffle.status !== "active"}
                          className="bg-primary hover:bg-primary/90 text-white"
                          size="sm"
                        >
                          <TrophyIcon className="w-4 h-4 mr-1" />
                          {isFinishing ? "Realizando..." : "Realizar Sorteo"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Ticket Requests Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-secondary">
                Solicitudes de Compra de Tickets
              </h3>
              <p className="text-accent">
                Revisa y gestiona las solicitudes pendientes de los clientes
              </p>
            </div>
            <Button
              onClick={loadTicketRequests}
              disabled={isLoadingRequests}
              variant="outline"
              size="sm"
            >
              {isLoadingRequests ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              ) : (
                <Clock className="w-4 h-4 mr-2" />
              )}
              Actualizar
            </Button>
          </div>

          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : ticketRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto text-accent mb-4" />
              <p className="text-accent">No hay solicitudes pendientes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ticketRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-2 border-orange-200 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-secondary">
                        Ticket #{request.ticketNumber}
                      </CardTitle>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pendiente
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      Solicitud de compra de {request.quantity} ticket{request.quantity > 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-secondary" />
                        <span className="font-medium text-secondary">{request.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent">{request.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent">{request.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Purchase Details */}
                    <div className="p-3 bg-secondary/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-accent">Cantidad:</span>
                        <span className="font-medium text-secondary">{request.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-accent">Total:</span>
                        <span className="font-medium text-secondary">${request.total}</span>
                      </div>
                    </div>

                    {/* Payment Proof Image */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-secondary">Comprobante de Pago</span>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={request.paymentProof}
                          alt="Comprobante de pago"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            // Fallback image if the payment proof fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%23666' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-accent/10">
                      <Button
                        onClick={() => handleApproveTicket(request.id)}
                        disabled={isProcessingTicket === request.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        {isProcessingTicket === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Aceptar
                      </Button>
                      <Button
                        onClick={() => handleRejectTicket(request.id)}
                        disabled={isProcessingTicket === request.id}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                      >
                        {isProcessingTicket === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <X className="w-4 h-4 mr-2" />
                        )}
                        Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Finish Raffle Modal */}
      <FinishRaffleModal
        isOpen={finishModalOpen}
        onClose={() => {
          setFinishModalOpen(false);
          setRaffleToFinish(null);
        }}
        onConfirm={confirmFinishRaffle}
        raffleName={raffleToFinish?.title || ""}
        isLoading={isFinishing}
      />
    </div>
  );
};