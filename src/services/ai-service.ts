import apiClient, { CanceledError } from "./api";

export { CanceledError };

// הגדרת ממשקים
export interface AIContent {
  topic?: string;
  content: string;
}

// הגבלת קצב בקשות
const MAX_REQUESTS_PER_MINUTE = 5;
let requestCount = 0;
let resetTimeout: number | null = null;

// הגדרת פונקציה לאיפוס מונה
const setupResetTimer = () => {
  if (resetTimeout === null) {
    resetTimeout = window.setTimeout(() => {
      requestCount = 0;
      resetTimeout = null;
    }, 60000); // איפוס אחרי דקה
  }
};

// תוכן מומלץ מבוסס AI
const getAIContent = () => {
  // בדיקת הגבלת קצב
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return {
      request: Promise.reject(
        new Error(`חרגת ממגבלת הבקשות (${MAX_REQUESTS_PER_MINUTE} בקשות בדקה). אנא נסה שוב מאוחר יותר.`)
      ),
      cancel: () => {}
    };
  }
  
  // הגדלת מונה בקשות
  requestCount++;
  setupResetTimer();
  
  const controller = new AbortController();
  const request = apiClient.get<AIContent>('/ai/content', {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

// קבלת תגובות מומלצות לפוסט
const getAIResponseForPost = (postContent: string) => {
  // בדיקת הגבלת קצב
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return {
      request: Promise.reject(
        new Error(`חרגת ממגבלת הבקשות (${MAX_REQUESTS_PER_MINUTE} בקשות בדקה). אנא נסה שוב מאוחר יותר.`)
      ),
      cancel: () => {}
    };
  }
  
  // הגדלת מונה בקשות
  requestCount++;
  setupResetTimer();
  
  const controller = new AbortController();
  const request = apiClient.post<AIContent>('/ai/respond', { content: postContent }, {
    signal: controller.signal
  });
  
  return { request, cancel: () => controller.abort() };
};

const aiService = {
  getAIContent,
  getAIResponseForPost
};

export default aiService;