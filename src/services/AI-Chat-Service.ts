import apiClient from "./api";

interface OpenAIMessage {
  role: 'assistant' | 'user' | 'system'; // Role of the message sender
  content: string; // The content of the message
  refusal: string | null; // Optional field indicating refusal (if any)
  annotations: any[]; // Annotations, if any, applied to the message
}

interface OpenAIChoice {
  index: number; // The index of the choice
  message: OpenAIMessage; // The generated message content
  logprobs: any | null; // Optional log probabilities for the message
  finish_reason: string; // Reason the generation finished (e.g., 'length', 'stop')
}



interface OpenAIResponse {
  id: string; // Unique request ID
  object: string; // The object type (e.g., "chat.completion")
  created: number; // Unix timestamp of when the completion was created
  model: string; // Model used for the completion (e.g., "gpt-3.5-turbo-0125")
  choices: OpenAIChoice[]; // The choices array containing the generated responses

}

const chatWithAI = (data: { message: string; model: string; location: any;  history: any[] }) => {
    const controller = new AbortController();
    const request = apiClient.post<OpenAIResponse>('/AI/chatMsg', data, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json' 
      }
    });
    
    return { request, cancel: () => controller.abort() };
  };

  const AIServices = {
    chatWithAI
  }
  export default AIServices;