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

const paymentMethods = [
  { id: "Transferencia Bancaria", name: "Transferencia Bancaria", icon: "🏦" },
  { id: "Zelle", name: "Zelle", icon: "💳" },
  { id: "Binance Pay", name: "Binance Pay", icon: "₿" },
];

interface UserFormData {
  name: string;
  phone: string;
  email: string;
}

interface UserFormProps {
  onSubmit?: (data: UserFormData) => void;
  onChange?: (data: UserFormData) => void;
}

export function UserForm({ onSubmit, onChange }: UserFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);

    // Call onChange whenever data changes
    if (onChange && updated.fullName && updated.phone && updated.email) {
      onChange({
        name: updated.fullName,
        phone: updated.phone,
        email: updated.email,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to expected format
    const submitData: UserFormData = {
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
    };
    onSubmit?.(submitData);
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
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              className="border-accent/30 focus:border-primary transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-accent font-medium">
              Celular *
            </Label>
            <Input
              id="phone"
              placeholder="Número de teléfono"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="border-accent/30 focus:border-primary transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-accent font-medium">
              Correo Electrónico *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="border-accent/30 focus:border-primary transition-all duration-200"
              required
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
