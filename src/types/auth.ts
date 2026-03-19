export interface IAuthResponse {
  access_token: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
}

// Runtime exports
export const AuthResponse = {} as IAuthResponse;
export const LoginRequest = {} as ILoginRequest;
export const RegisterRequest = {} as IRegisterRequest;

// Type aliases for backward compatibility
export type AuthResponse = IAuthResponse;
export type LoginRequest = ILoginRequest;
export type RegisterRequest = IRegisterRequest;
