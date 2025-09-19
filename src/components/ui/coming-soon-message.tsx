import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Instagram } from "lucide-react";

export function ComingSoonMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">
              🎉 ¡Próximamente Rifas Increíbles! 🎉
            </h3>
            <p className="text-lg text-secondary font-medium">
              Estamos preparando rifas espectaculares para ti
            </p>
            <p className="text-accent max-w-md mx-auto">
              Mantente atento a nuestras redes sociales y regresa pronto. 
              ¡Las mejores oportunidades de ganar están por venir!
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
            <p className="text-sm font-semibold text-primary mb-2">
              💡 Mientras tanto...
            </p>
            <p className="text-sm text-secondary">
              Síguenos en nuestras redes sociales para ser el primero en enterarte de las nuevas rifas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a 
                href="https://www.tiktok.com/@rifas.quemantequi?_t=ZM-8zrWw8Rs1y0&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                Síguenos en TikTok
              </a>
            </Button>
            <Button className="bg-accent hover:bg-accent/90" asChild>
              <a 
                href="https://www.instagram.com/rifas.quemantequilla?utm_source=qr&igsh=MTZ1cDQ5cHNwdGhhNQ==" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Síguenos en Instagram
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
