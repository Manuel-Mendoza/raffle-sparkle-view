import { api } from "@/lib/api";
import { LoginRequest, AuthResponse, RegisterRequest } from "@/types/api";

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/admin/register", data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/admin/login", data);
    const { token } = response.data;

    // Guardar token en localStorage
    localStorage.setItem("token", token);

    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
