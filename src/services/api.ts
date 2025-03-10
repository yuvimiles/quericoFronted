import axios, { CanceledError } from "axios";

// יצוא השגיאה לשימוש במקומות אחרים
export { CanceledError };

// הגדרת המשתנה הסביבתי או ברירת מחדל אם חסר
const API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:5000/";

// יצירת מופע axios עם הגדרות בסיסיות
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor להוספת טוקן לכל בקשה
apiClient.interceptors.request.use(
  (config) => {
    // בדיקה אם יש טוקן בלוקל סטורג'
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor לטיפול בשגיאות
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // טיפול בשגיאת 401 (לא מורשה)
    if (error.response && error.response.status === 401) {
      // רענון טוקן או ניתוב לעמוד התחברות
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;