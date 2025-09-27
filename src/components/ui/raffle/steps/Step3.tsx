import { Button } from "@/components/ui/base/button";
import { Card, CardContent } from "@/components/ui/base/card";
import { formatBsVSimple, formatUSD } from "@/lib/currency";
import { ZELLE_TICKET_PRICE } from "@/lib/constants";
import type { Raffle } from "@/services/raffle";
import type { PurchaseData } from "@/types/purchase";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface Step3Props {
  onFinalConfirm: () => void;
  onPrevStep: () => void;
  purchaseData: PurchaseData;
  raffleData: Raffle;
  loading: boolean;
}

export function Step3({
  onFinalConfirm,
  onPrevStep,
  purchaseData,
  raffleData,
  loading,
}: Step3Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-secondary mb-2">
          Aceptar y ver números de tickets
        </h3>
        <p className="text-accent">
          Confirma tu compra para ver tus números de tickets
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <h4 className="font-semibold text-secondary mb-4">
            Resumen de Compra
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-accent mb-2">Rifa:</h5>
              <p className="text-secondary">{raffleData.title}</p>
            </div>

            <div>
              <h5 className="font-medium text-accent mb-2">Boletos:</h5>
              <p className="text-secondary">{purchaseData.tickets} boletos</p>
              <p className="text-lg font-bold text-primary">
                Total:{" "}
                {purchaseData.paymentMethod === "Zelle"
                  ? `$${formatUSD(purchaseData.tickets * ZELLE_TICKET_PRICE)} dolares`
                  : formatBsVSimple(purchaseData.total)}
              </p>
            </div>
          </div>

          {purchaseData.userData && (
            <div className="mt-4 pt-4 border-t border-accent/20">
              <h5 className="font-medium text-accent mb-2">
                Datos del Participante:
              </h5>
              <p className="text-secondary">{purchaseData.userData.name}</p>
              <p className="text-sm text-muted-foreground">
                {purchaseData.userData.phone}
              </p>
              <p className="text-sm text-muted-foreground">
                {purchaseData.userData.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Método de pago: {purchaseData.paymentMethod}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button
          onClick={onFinalConfirm}
          disabled={loading}
          className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow text-lg px-12 py-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              Aceptar y Ver Mis Números
              <CheckCircle className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="outline"
            onClick={onPrevStep}
            disabled={loading}
            className="border-accent/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
