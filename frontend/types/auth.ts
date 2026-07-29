export type LoginResponse = {
  token?: string;
  accessToken?: string;
  message?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

export type LoginCredentials = {
  email: string;
  password: string;
};