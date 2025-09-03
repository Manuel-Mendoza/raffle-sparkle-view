import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular login
    setTimeout(() => {
      if (email === "admin@rifas.com" && password === "admin123") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "admin");
        toast({
          title: "¡Bienvenido!",
          description: "Inicio de sesión exitoso",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Credenciales incorrectas",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a inicio
          </Link>
        </div>

        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-secondary">
              Rifas q' Mantequilla
            </CardTitle>
            <CardDescription className="text-accent">
              Panel Administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondary font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rifas.com"
                  required
                  className="border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-secondary font-medium"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="border-primary/20 focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent/80"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-sm text-accent">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Registrarse
                </Link>
              </div>

              <div className="text-xs text-accent/60 text-center p-4 bg-accent/5 rounded-lg">
                <strong>Credenciales de prueba:</strong>
                <br />
                Email: admin@rifas.com
                <br />
                Contraseña: admin123
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
