import apiClient, { CanceledError } from "./api";
import { User } from "../types/user-type";

export { CanceledError };

// עדכון פרופיל משתמש
const getAllUsers = () => {
  const controller = new AbortController();
  const request = apiClient.get<{ users: User[] }>('/users/getAll', {
    signal: controller.signal,
  });

  return { request, cancel: () => controller.abort() };
};

const updateLoggedUser = (user: User)=> {
  localStorage.setItem('user', JSON.stringify(user));
}
// חיפוש משתמשים (לפי שם משתמש)
const searchUsers = (query: string) => {
  const controller = new AbortController();
  const request = apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};
const updateUserProfile = (updatedData: FormData) =>{
  const controller = new AbortController();
  const request = apiClient.post<User>(`/users/update`,updatedData ,{
    signal: controller.signal,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return { request, cancel: () => controller.abort() };
}

const userService = {
  getAllUsers,
  searchUsers,
  updateLoggedUser,
  updateUserProfile
};

export default userService;