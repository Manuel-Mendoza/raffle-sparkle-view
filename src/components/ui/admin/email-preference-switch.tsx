import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/base/switch";
import { Label } from "@/components/ui/base/label";
import { emailPreferenceService } from "@/services/email-preference";
import { toast } from "sonner";

export const EmailPreferenceSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadEmailPreference();
  }, []);

  const loadEmailPreference = async () => {
    try {
      setIsLoading(true);
      const preference = await emailPreferenceService.getEmailPreference();
      setIsEnabled(preference.receiveEmails);
    } catch (error) {
      console.error("Error loading email preference:", error);
      toast.error("Error al cargar preferencias de email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      await emailPreferenceService.updateEmailPreference(checked);
      setIsEnabled(checked);
      toast.success(
        checked
          ? "Notificaciones por email activadas"
          : "Notificaciones por email desactivadas"
      );
    } catch (error) {
      console.error("Error updating email preference:", error);
      toast.error("Error al actualizar preferencias de email");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <Label>Cargando...</Label>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
      />
      <Label className="text-sm font-medium">
        {isUpdating ? "Actualizando..." : "Notificaciones por Email"}
      </Label>
    </div>
  );
};
