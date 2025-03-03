import apiClient, { CanceledError } from "./api";
import { IComment } from "../types/user-type";

export { CanceledError };

// הגדרת ממשקים לפי המבנה הקיים
export interface Post {
  _id: string;
  author: string; // IUser['_id']
  text: string;
  image?: string;
  likes: string[]; // מערך של IUser['_id']
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithAuthor extends Omit<Post, 'author'> {
  author: {
    _id: string;
    username: string;
    profileImage: string;
  };
}

export interface PostCreateData {
  text: string;
  image?: File;
}

export interface PostUpdateData {
  text: string;
  image?: File;
}

// קבלת כל הפוסטים עם paging
const getAllPosts = (page: number = 1, limit: number = 10) => {
  const controller = new AbortController();
  const request = apiClient.get<{ posts: PostWithAuthor[], total: number }>(`/posts?page=${page}&limit=${limit}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// קבלת פוסטים של משתמש ספציפי
const getUserPosts = (userId: string, page: number = 1, limit: number = 10) => {
  const controller = new AbortController();
  const request = apiClient.get<{ posts: PostWithAuthor[], total: number }>(`/posts/user/${userId}?page=${page}&limit=${limit}`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// קבלת פוסט לפי ID
const getPostById = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.get<PostWithAuthor>(`/posts/${postId}`, {
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

// הוספת תגובה לפוסט
const addComment = (postId: string, text: string) => {
  const controller = new AbortController();
  const request = apiClient.post<IComment>(`/posts/${postId}/comments`, { text }, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// קבלת תגובות לפוסט
const getPostComments = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.get<IComment[]>(`/posts/${postId}/comments`, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// לייק לפוסט
const likePost = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.post(`/posts/${postId}/like`, {}, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// ביטול לייק לפוסט
const unlikePost = (postId: string) => {
  const controller = new AbortController();
  const request = apiClient.delete(`/posts/${postId}/like`, {
    signal: controller.signal
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
  addComment,
  getPostComments,
  likePost,
  unlikePost
};

export default postService;