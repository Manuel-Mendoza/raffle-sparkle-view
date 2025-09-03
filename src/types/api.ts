export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    username: string;
  };
}

export interface ApiError {
  error: string;
}

export interface AxiosErrorResponse {
  response?: {
    data?: ApiError;
  };
}
