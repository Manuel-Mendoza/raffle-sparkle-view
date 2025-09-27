import { Button } from "@/components/ui/base/button";
import { Card, CardContent } from "@/components/ui/base/card";
import { Input } from "@/components/ui/base/input";
import { Label } from "@/components/ui/base/label";
import { formatBsVSimple, formatUSD } from "@/lib/currency";
import paymentData from "@/lib/payment-data.json";
import { ZELLE_TICKET_PRICE } from "@/lib/constants";
import { PurchaseData } from "@/types/purchase";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Copy,
  Loader2,
} from "lucide-react";

const bankTransferData = {
  Nombre: paymentData.transferenciaBancaria.nombre,
  "Tipo de cuenta": paymentData.transferenciaBancaria.tipoDeCuenta,
  "Número de cuenta": paymentData.transferenciaBancaria.numeroDeCuenta,
  "Documento de identidad":
    paymentData.transferenciaBancaria.documentoDeIdentidad,
};

const mobilePaymentData = {
  Banco: paymentData.pagoMovil.banco,
  Celular: paymentData.pagoMovil.celular,
  Cedula: paymentData.pagoMovil.cedula,
};

const zellePaymentData = {
  Nombre: paymentData.zelle.nombre,
  Email: paymentData.zelle.email,
};


interface Step2Props {
  onNextStep: () => void;
  onPrevStep: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPurchaseData: React.Dispatch<React.SetStateAction<PurchaseData>>;
  purchaseData: PurchaseData;
  loading: boolean;
  handleCopy: (text: string, field: string) => void;
}

export function Step2({
  onNextStep,
  onPrevStep,
  onFileUpload,
  setPurchaseData,
  purchaseData,
  loading,
  handleCopy,
}: Step2Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">
          Método de pago y comprobante
        </h3>
        <p className="text-accent">
          Selecciona tu método de pago y sube el comprobante de{" "}
          {purchaseData.paymentMethod === "Zelle"
            ? formatUSD(purchaseData.tickets * ZELLE_TICKET_PRICE)
            : formatBsVSimple(purchaseData.total)}
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <h4 className="font-semibold text-accent mb-4">
            Selecciona tu método de pago
          </h4>

          <div className="space-y-3 mb-6">
            {[
              { id: "Pago Movil", name: "Pago Móvil", icon: "📱" },
              {
                id: "Transferencia Bancaria",
                name: "Transferencia Bancaria",
                icon: "🏦",
              },
              {
                id: "Zelle",
                name: "Zelle",
                icon: "📲",
              },
            ].map((method) => (
              <div
                key={method.id}
                onClick={() =>
                  setPurchaseData((prev: PurchaseData) => ({
                    ...prev,
                    paymentMethod: method.id,
                  }))
                }
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${purchaseData.paymentMethod === method.id
                    ? "border-primary bg-primary/10"
                    : "border-accent/20 hover:border-primary/30"
                  }`}
              >
                <span className="text-primary">{method.name}</span>
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  {method.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-accent">Datos para el pago:</h5>
            </div>
            <div className="text-sm text-accent space-y-2">
              {purchaseData.paymentMethod === "Transferencia Bancaria"
                ? Object.entries(bankTransferData).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <span className="text-secondary">
                      <strong className="text-primary">{key}:</strong> {value}
                    </span>
                    <Button
                      onClick={() => handleCopy(value, key)}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))
                : purchaseData.paymentMethod === "Zelle"
                  ? Object.entries(zellePaymentData).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span className="text-secondary">
                        <strong className="text-primary">{key}:</strong>{" "}
                        {value}
                      </span>
                      <Button
                        onClick={() => handleCopy(value, key)}
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                  : Object.entries(mobilePaymentData).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span className="text-secondary">
                        <strong className="text-primary">{key}:</strong>{" "}
                        {value}
                      </span>
                      <Button
                        onClick={() => handleCopy(value, key)}
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
              <div className="flex justify-between items-center">
                <span className="text-secondary">
                  <strong className="text-primary">Monto:</strong>{" "}
                  {purchaseData.paymentMethod === "Zelle"
                    ? `$${formatUSD(purchaseData.tickets * ZELLE_TICKET_PRICE)} dolares`
                    : formatBsVSimple(purchaseData.total)}
                </span>
                <Button
                  onClick={() =>
                    handleCopy(
                      purchaseData.paymentMethod === "Zelle"
                        ? (purchaseData.tickets * ZELLE_TICKET_PRICE).toFixed(2)
                        : purchaseData.total.toString(),
                      "Monto"
                    )
                  }
                  variant="ghost"
                  size="sm"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="payment-proof" className="text-primary font-medium">
              Subir comprobante *
            </Label>
            <Input
              id="payment-proof"
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              disabled={loading}
              className="border-accent/30"
            />

            {loading && (
              <div className="flex items-center text-accent">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subiendo comprobante...
              </div>
            )}

            {purchaseData.paymentProof && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Comprobante subido exitosamente
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevStep}
          className="border-accent/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Button
          onClick={onNextStep}
          disabled={!purchaseData.paymentProof}
          className="bg-primary hover:bg-primary/90 px-8"
        >
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
