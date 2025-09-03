import { api } from "@/lib/api";
import { LoginRequest, AuthResponse } from "@/types/api";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/admin/login", data);
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
