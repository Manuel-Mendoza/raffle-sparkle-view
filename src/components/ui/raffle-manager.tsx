import { useState, useEffect, useCallback } from "react";
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
import { PaymentProofModal } from "@/components/ui/payment-proof-modal";
import { WinnerModal } from "@/components/ui/winner-modal";
import {
  Trophy,
  Banknote,
  Users,
  Plus,
  Trophy as TrophyIcon,
  Upload,
  Check,
  X,
  User,
  Phone,
  CreditCard,
  Eye,
} from "lucide-react";
import { raffleService, Raffle } from "@/services/raffle";
import { uploadImageToImgBB } from "@/services/imgbb";
import { adminService, CustomerTicket } from "@/services/admin";
import { AxiosErrorResponse } from "@/types/api";
import { formatBsV } from "@/lib/currency";

type PurchaseRequest = CustomerTicket;

export const RaffleManager = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [raffleToFinish, setRaffleToFinish] = useState<Raffle | null>(null);
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""]);
  interface Winner {
    customerName: string;
    ticketNumber: number;
  }

  const [winnerModal, setWinnerModal] = useState<{
    isOpen: boolean;
    winner: Winner | null;
    totalParticipants: number;
    raffleName: string;
  }>({
    isOpen: false,
    winner: null,
    totalParticipants: 0,
    raffleName: "",
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(
    []
  );
  const [isProcessingRequest, setIsProcessingRequest] = useState<string | null>(
    null
  );
  const [paymentProofModal, setPaymentProofModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    customerName: string;
  }>({
    isOpen: false,
    imageUrl: "",
    customerName: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    ticketPrice: 0,
    endDate: "",
    image: "",
  });

  const loadPurchaseRequests = useCallback(async () => {
    try {
      const customers = await adminService.getPendingTickets();
      setPurchaseRequests(customers);
    } catch (error) {
      console.error("Error loading purchase requests:", error);
      setPurchaseRequests([]);
    }
  }, []);

  useEffect(() => {
    loadRaffles();
    loadPurchaseRequests();
  }, [loadPurchaseRequests]);

  useEffect(() => {
    loadPurchaseRequests();
  }, [loadPurchaseRequests]);

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
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.prize.trim() ||
      !formData.ticketPrice ||
      formData.ticketPrice <= 0 ||
      !formData.endDate ||
      !formData.image
    ) {
      alert("Todos los campos son requeridos");
      return;
    }

    try {
      setIsCreating(true);
      const raffleData = {
        ...formData,
        totalTickets: 10000,
        startDate: new Date().toISOString(),
      };
      await raffleService.createRaffle(raffleData);
      await loadRaffles();
      resetForm();
      setIsCreateModalOpen(false);
      alert("¡Rifa creada exitosamente!");
    } catch (error: unknown) {
      console.error("Error creating raffle:", error);
      const axiosError = error as AxiosErrorResponse;
      alert(
        "Error al crear la rifa: " +
          (axiosError.response?.data?.error ||
            axiosError.message ||
            "Error desconocido")
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleFinishRaffle = async (raffle: Raffle) => {
    setRaffleToFinish(raffle);
    setFinishModalOpen(true);
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const confirmFinishRaffle = async () => {
    const fullNumber = parseInt(pinDigits.join(""));
    if (!raffleToFinish || !fullNumber || fullNumber <= 0) {
      alert("Por favor ingresa un número ganador válido");
      return;
    }

    try {
      setIsFinishing(true);
      const result = await adminService.setWinnerNumber(
        raffleToFinish.id,
        fullNumber
      );
      await loadRaffles();

      setWinnerModal({
        isOpen: true,
        winner: result.winner,
        totalParticipants: result.totalParticipants,
        raffleName: raffleToFinish.title,
      });

      setFinishModalOpen(false);
      setRaffleToFinish(null);
      setPinDigits(["", "", "", ""]);
    } catch (error) {
      console.error("Error setting winner number:", error);
      alert("Error al establecer el número ganador");
    } finally {
      setIsFinishing(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadImageToImgBB(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen. Intenta de nuevo.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleApprovePurchase = async (requestId: string) => {
    setIsProcessingRequest(requestId);
    try {
      await adminService.approveTicket(requestId);
      await loadPurchaseRequests();
      alert("¡Solicitud de compra aprobada exitosamente!");
    } catch (error) {
      console.error("Error approving purchase:", error);
      alert("Error al aprobar la solicitud");
    } finally {
      setIsProcessingRequest(null);
    }
  };

  const handleRejectPurchase = async (requestId: string) => {
    setIsProcessingRequest(requestId);
    try {
      await adminService.rejectTicket(requestId);
      await loadPurchaseRequests();
      alert("Solicitud de compra rechazada");
    } catch (error) {
      console.error("Error rejecting purchase:", error);
      alert("Error al rechazar la solicitud");
    } finally {
      setIsProcessingRequest(null);
    }
  };

  const getRequestId = (request: PurchaseRequest): string => {
    return request.customerId;
  };

  const getTicketCount = (request: PurchaseRequest): number => {
    return request.tickets.length;
  };

  const openPaymentProofModal = (imageUrl: string, customerName: string) => {
    setPaymentProofModal({
      isOpen: true,
      imageUrl,
      customerName,
    });
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
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-medium text-secondary">
                      {raffle.prize}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-secondary/5 rounded">
                      <Banknote className="w-4 h-4 mx-auto text-secondary mb-1" />
                      <p className="text-sm font-medium text-secondary">
                        {formatBsV(raffle.ticketPrice)}
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
                      Total recaudado: {formatBsV(totalRevenue)}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-accent/10 mt-4">
                    <Button
                      onClick={() => handleFinishRaffle(raffle)}
                      disabled={isFinishing || raffle.status !== "active"}
                      className="bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      <TrophyIcon className="w-4 h-4 mr-1" />
                      {isFinishing ? "Procesando..." : "Establecer Ganador"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Purchase Requests Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-secondary">
              Solicitudes de Compra
            </h3>
            <p className="text-accent">
              Gestiona las solicitudes de compra de tickets de los clientes
            </p>
          </div>
        </div>

        {purchaseRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-accent">
              No hay solicitudes pendientes en este momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {purchaseRequests.map((request) => {
              const requestId = getRequestId(request);
              const ticketCount = getTicketCount(request);
              const total = ticketCount * 50;

              return (
                <Card
                  key={requestId}
                  className="border-2 border-primary/20 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-secondary">
                        {request.customerName}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {request.raffleTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-secondary">
                            Cliente
                          </p>
                          <p className="text-xs text-accent">
                            {request.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-secondary">
                            Teléfono
                          </p>
                          <p className="text-xs text-accent">
                            {request.customerPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-secondary">
                            Método de Pago
                          </p>
                          <p className="text-xs text-accent">
                            {request.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-secondary">
                            Total
                          </p>
                          <p className="text-xs text-accent">
                            {ticketCount} ticket(s) - ${total}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-secondary">
                          Comprobante de Pago
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          openPaymentProofModal(
                            request.paymentProof,
                            request.customerName
                          )
                        }
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Comprobante
                      </Button>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-accent/10">
                      <Button
                        variant="outline"
                        onClick={() => handleRejectPurchase(requestId)}
                        disabled={isProcessingRequest === requestId}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        {isProcessingRequest === requestId
                          ? "Procesando..."
                          : "Rechazar"}
                      </Button>
                      <Button
                        onClick={() => handleApprovePurchase(requestId)}
                        disabled={isProcessingRequest === requestId}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {isProcessingRequest === requestId
                          ? "Procesando..."
                          : "Aceptar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Finish Raffle Modal */}
      <Dialog open={finishModalOpen} onOpenChange={setFinishModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Establecer Número Ganador</DialogTitle>
            <DialogDescription>
              Ingresa el número ganador para la rifa "{raffleToFinish?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Número Ganador</Label>
              <div className="flex justify-center space-x-2">
                {pinDigits.map((digit, index) => (
                  <Input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold"
                  />
                ))}
              </div>
              <p className="text-xs text-center text-accent">
                Ingresa el número ganador (4 dígitos)
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setFinishModalOpen(false);
                setRaffleToFinish(null);
                setPinDigits(["", "", "", ""]);
              }}
              disabled={isFinishing}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmFinishRaffle}
              disabled={isFinishing || pinDigits.some((d) => !d)}
              className="bg-primary hover:bg-primary/90"
            >
              {isFinishing ? "Procesando..." : "Establecer Ganador"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Modal */}
      <PaymentProofModal
        isOpen={paymentProofModal.isOpen}
        onClose={() =>
          setPaymentProofModal({
            isOpen: false,
            imageUrl: "",
            customerName: "",
          })
        }
        imageUrl={paymentProofModal.imageUrl}
        customerName={paymentProofModal.customerName}
      />

      {/* Winner Modal */}
      <WinnerModal
        isOpen={winnerModal.isOpen}
        onClose={() =>
          setWinnerModal({
            isOpen: false,
            winner: null,
            totalParticipants: 0,
            raffleName: "",
          })
        }
        winner={winnerModal.winner}
        totalParticipants={winnerModal.totalParticipants}
        raffleName={winnerModal.raffleName}
      />
    </div>
  );
};
