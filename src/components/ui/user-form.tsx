import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Phone, CreditCard } from "lucide-react";

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "FR" },
  { code: "+34", country: "ES" },
  { code: "+55", country: "BR" },
  { code: "+52", country: "MX" },
  { code: "+57", country: "CO" },
  { code: "+58", country: "VE" },
  { code: "+593", country: "EC" },
  { code: "+591", country: "BO" },
];

interface UserFormProps {
  onSubmit?: (data: Record<string, unknown>) => void;
}

export function UserForm({ onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    countryCode: "+58",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/5 border-secondary/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center text-secondary">
          <User className="w-5 h-5 mr-2 text-primary" />
          Datos Personales
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-accent font-medium">
              Nombres y Apellidos *
            </Label>
            <Input
              id="fullName"
              placeholder="Ingresa tu nombre completo"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="border-accent/30 focus:border-primary transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-accent font-medium">
              Celular *
            </Label>
            <div className="flex space-x-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) =>
                  setFormData({ ...formData, countryCode: value })
                }
              >
                <SelectTrigger className="w-24 border-accent/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                placeholder="Número de teléfono"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="flex-1 border-accent/30 focus:border-primary transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 pt-4 border-t border-accent/10">
            <h3 className="flex items-center font-semibold text-secondary">
              <CreditCard className="w-4 h-4 mr-2 text-primary" />
              Modos de Pago
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-accent/20 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                <span className="text-accent">Transferencia Bancaria</span>
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  🏦
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-accent/20 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                <span className="text-accent">Zelle</span>
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  💳
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-accent/20 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                <span className="text-accent">Binance Pay</span>
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  ₿
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow transition-all duration-300 text-lg py-6"
          >
            Confirmar Compra
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
