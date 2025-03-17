import apiClient from "./api";
import { IComment } from "../types/user-type";

// הוספת תגובה לפוסט
const addComment = (postId: string, text: string) => {
    const controller = new AbortController();
    const request = apiClient.post<IComment>(
      `/comments/createComment/${postId}`,
      { text },
      { signal: controller.signal }
    );
    
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
  const updateComment = (commentId: string, text: string) => {
    const controller = new AbortController();
    const request = apiClient.put<IComment>(`/comments/${commentId}`, { text }, {
      signal: controller.signal
    });
    
    return { request, cancel: () => controller.abort() };
}
const deleteComment = (commentId: string) => {
    const controller = new AbortController();
    const request = apiClient.delete(`/comments/${commentId}`, {
      signal: controller.signal
    });
    return { request, cancel: () => controller.abort() };
  }
  
  const commentService = {
    addComment,
    getPostComments,
    updateComment,
    deleteComment,
  }
  export default commentService;