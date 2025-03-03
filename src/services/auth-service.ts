import apiClient, { CanceledError } from "./api";
import { User } from "../types/user-type";

export { CanceledError };

// הגדרת ממשקים 
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
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
  const request = apiClient.post<AuthResponse>('/auth/refresh-token', {}, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// התנתקות
const logout = () => {
  const controller = new AbortController();
  const request = apiClient.post('/auth/logout', {}, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// שמירת הטוקן ופרטי המשתמש
const saveAuth = (auth: AuthResponse) => {
  localStorage.setItem('auth_token', auth.accessToken);
  if (auth.refreshToken) {
    localStorage.setItem('refresh_token', auth.refreshToken);
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
  return localStorage.getItem('auth_token');
};

// בדיקה אם המשתמש מחובר
const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ניקוי מידע מהלוקל סטורג' בעת התנתקות
const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// התחברות באמצעות Google
const loginWithGoogle = () => {
  // שימוש בכתובת בסיסית במקום apiClient.defaults.baseURL אם הוא לא זמין
  const baseURL = "http://localhost:5000/api"; // או כל כתובת אחרת רלוונטית
  window.location.href = `${baseURL}/auth/google`;
};

// התחברות באמצעות Facebook
const loginWithFacebook = () => {
  // שימוש בכתובת בסיסית במקום apiClient.defaults.baseURL אם הוא לא זמין
  const baseURL = "http://localhost:5000/api"; // או כל כתובת אחרת רלוונטית
  window.location.href = `${baseURL}/auth/facebook`;
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
  loginWithGoogle,
  loginWithFacebook
};

export default authService;