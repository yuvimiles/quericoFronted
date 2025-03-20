import apiClient, { CanceledError } from "./api";



//TODO:: Look up how data is being sent to server and back to client
const chatWithAI = (formData : FormData) => {
    const controller = new AbortController();
    const request = apiClient.post<{data : any}>('/AI/chatMsg', formData, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return { request, cancel: () => controller.abort() };
  };

  const AIServices = {
    chatWithAI
  }
  export default AIServices;