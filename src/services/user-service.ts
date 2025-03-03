import apiClient, { CanceledError } from "./api";
import { User, UserUpdateRequest, PasswordChangeRequest } from "../types/user-type";

export { CanceledError };

// קבלת פרופיל משתמש
const getUserProfile = (userId: string) => {
  const controller = new AbortController();
  const request = apiClient.get<User>(`/users/${userId}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// עדכון פרופיל משתמש
const updateUserProfile = (userId: string, userData: UserUpdateRequest) => {
  const controller = new AbortController();
  
  // אם מעדכנים תמונת פרופיל, משתמשים ב-FormData
  if (userData.profileImage) {
    const formData = new FormData();
    
    if (userData.username) formData.append('username', userData.username);
    if (userData.email) formData.append('email', userData.email);
    
    formData.append('profileImage', userData.profileImage);
    
    const request = apiClient.put<User>(`/users/${userId}`, formData, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return { request, cancel: () => controller.abort() };
  }
  
  // אם אין תמונה, שליחת JSON רגיל
  const request = apiClient.put<User>(`/users/${userId}`, userData, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// החלפת סיסמה
const changePassword = (data: PasswordChangeRequest) => {
  const controller = new AbortController();
  const request = apiClient.post<{ success: boolean, message: string }>('/users/change-password', data, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// חיפוש משתמשים (לפי שם משתמש)
const searchUsers = (query: string) => {
  const controller = new AbortController();
  const request = apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

const userService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  searchUsers
};

export default userService;