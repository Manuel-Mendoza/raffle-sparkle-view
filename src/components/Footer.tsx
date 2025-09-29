import { MessageCircle } from "lucide-react";

export const Footer = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "584124796280";
    const message = "Hola, necesito soporte con Rifas.queMantequilla";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <footer className="bg-background border-t mt-auto shrink-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Soporte</span>
          </button>
          <p className="text-sm text-muted-foreground">
            © 2025 Rifas.queMantequilla. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
