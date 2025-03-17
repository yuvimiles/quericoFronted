import apiClient, { CanceledError } from "./api";
import { User } from "../types/user-type";

export { CanceledError };

// הגדרת ממשקים 
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
// התחברות
const login = (credentials: LoginRequest) => {
  const controller = new AbortController();
  const request = apiClient.post<AuthResponse>('/auth/login', credentials, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};
// התחברות באמצעות Google
const loginWithGoogleToken = (credential: string) => {
  const controller = new AbortController();
  const request = apiClient.post<AuthResponse>('/auth/googleAuth', { credential }, {
    signal: controller.signal,
  });

  return { request, cancel: () => controller.abort() };
};
// הרשמה
const register = (userData: RegisterRequest) => {
  const controller = new AbortController();
  const request = apiClient.post<AuthResponse>('/auth/register', userData, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// רענון טוקן
const refreshToken = () => {
  const controller = new AbortController();
  const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token from localStorage

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const request = apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }, {
    signal: controller.signal
  });

  return { request, cancel: () => controller.abort() };
};

// התנתקות
const logout = () => {
  const controller = new AbortController();
  const request = apiClient.post('/auth/logout',  {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// שמירת הטוקן ופרטי המשתמש
const saveAuth = (auth: AuthResponse) => {
  localStorage.setItem('accessToken', auth.accessToken);
  if (auth.refreshToken) {
    localStorage.setItem('refreshToken', auth.refreshToken);
  }
  localStorage.setItem('user', JSON.stringify(auth.user));
};

// קבלת המשתמש הנוכחי מהלוקל סטורג'
const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// קבלת הטוקן
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// בדיקה אם המשתמש מחובר
const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ניקוי מידע מהלוקל סטורג' בעת התנתקות
const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const authService = {
  login,
  register,
  refreshToken,
  logout,
  saveAuth,
  getCurrentUser,
  getToken,
  isAuthenticated,
  clearAuth,
  loginWithGoogleToken
};

export default authService;