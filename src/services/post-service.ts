import apiClient, { CanceledError } from "./api";
import { IComment } from "../types/user-type";

export { CanceledError };

// הגדרת ממשקים לפי המבנה הקיים
export interface Post {
  _id: string;
  author:{
    _id?: string;
    name?: string;
    profileImage?: string;
  }; // IUser['_id']
  text: string;
  image?: string;
  likes: string[]; // מערך של IUser['_id']
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostCreateData {
  text: string;
  image?: File;
}

export interface PostUpdateData {
  text: string;
  image?: File | null;
}

// קבלת כל הפוסטים עם paging
const getAllPosts = (page: number = 1, limit: number = 10) => {
  const controller = new AbortController();
  const request = apiClient.get<{ posts: Post[], total: number }>(`/posts?page=${page}&limit=${limit}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// קבלת פוסטים של משתמש ספציפי
const getUserPosts = (userId: string, page: number = 1, limit: number = 10) => {
  const controller = new AbortController();
  const request = apiClient.get<{ posts: Post[], total: number }>(`/posts/user/${userId}?page=${page}&limit=${limit}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// קבלת פוסט לפי ID
const getPostById = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.get<Post>(`/posts/${postId}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// יצירת פוסט חדש
const createPost = (postData: PostCreateData) => {
  const controller = new AbortController();
  
  // יצירת אובייקט FormData לשליחת תמונה עם הפוסט
  const formData = new FormData();
  formData.append('text', postData.text);
  
  if (postData.image) {
    formData.append('image', postData.image);
  }
  
  const request = apiClient.post<Post>('/posts', formData, {
    signal: controller.signal,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return { request, cancel: () => controller.abort() };
};

// עדכון פוסט קיים
const updatePost = (postId: string, postData: PostUpdateData) => {
  const controller = new AbortController();
  
  // יצירת אובייקט FormData לשליחת תמונה עם הפוסט
  const formData = new FormData();
  formData.append('text', postData.text);
  
  if (postData.image) {
    formData.append('image', postData.image);
  }
  
  const request = apiClient.put<Post>(`/posts/${postId}`, formData, {
    signal: controller.signal,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return { request, cancel: () => controller.abort() };
};

// מחיקת פוסט
const deletePost = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.delete(`/posts/${postId}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};




const toggleLike = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.post(`/posts/${postId}/like`, {}, {
    signal: controller.signal,
  });

  return { request, cancel: () => controller.abort() };
};
const postService = {
  getAllPosts,
  getUserPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike
};

export default postService;