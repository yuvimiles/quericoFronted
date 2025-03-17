import axios, { CanceledError } from "axios";

// יצוא השגיאה לשימוש במקומות אחרים
export { CanceledError };

// הגדרת המשתנה הסביבתי או ברירת מחדל אם חסר
const API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:5000/";
// Function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

    // Assuming the response contains the new access token
    const { accessToken} = response.data;
    const newRefreshToken = response.data.refreshToken;
    // Store the new access token
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    throw new Error("Unable to refresh access token");
  }
};
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
  async (error) => {
    // טיפול בשגיאת 401 (לא מורשה)
    if (error.response && error.response.status === 401) {
      // רענון טוקן או ניתוב לעמוד התחברות
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    if(error.response && error.response.status === 403 && error.response.data?.message === "Invalid or expired token"){
      try{
        const newAccessToken = await refreshAccessToken();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(error.config);
      }catch(refreshError){
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;