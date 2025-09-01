import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-motorcycle.jpg";

interface HeroSectionProps {
  onVerifyTickets?: () => void;
}

export function HeroSection({ onVerifyTickets }: HeroSectionProps) {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-12">
        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
          ¡RIFA ESPECIAL!
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
          AQUÍ VA TU
          <span className="block text-accent font-extrabold text-6xl md:text-7xl">
            IMAGEN
          </span>
        </h1>
        
        <div className="inline-block bg-gradient-to-r from-primary to-primary/80 px-8 py-4 rounded-lg shadow-glow mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            PRECIO
          </h2>
        </div>
        
        <p className="text-xl text-primary-foreground/90 mb-8 font-medium">
          ¡Gana increíbles premios en nuestra gran rifa de motos y más!
        </p>
        
        <Button 
          onClick={onVerifyTickets}
          className="bg-accent hover:bg-accent/90 text-secondary font-bold px-8 py-3 text-lg transition-all duration-300 hover:shadow-glow"
        >
          <Search className="w-5 h-5 mr-2" />
          VERIFICADOR DE BOLETOS
        </Button>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-8 left-8 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-pulse delay-1000" />
    </div>
  );
}