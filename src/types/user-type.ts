// הגדרת ממשק למשתמש לפי המבנה הקיים
export interface User {
    _id: string; // mongoose.Types.ObjectId
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    googleId?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // ממשק מקוצר למשתמש עם פרטים בסיסיים בלבד
  export interface UserBasic {
    _id: string;
    username: string;
    profileImage: string;
  }
  
  // ממשק לעדכון פרטי משתמש
  export interface UserUpdateRequest {
    username?: string;
    email?: string;
    profileImage?: File;
  }
  
  // ממשק להחלפת סיסמה
  export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  // ממשק לתגובה בשירות
  export interface IComment {
    _id: string;
    author: string; // IUser['_id']
    post: string; // IPost['_id']
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // ממשק מורחב לתגובה עם פרטי המשתמש המגיב
  export interface ICommentWithAuthor {
    _id: string;
    author: UserBasic;
    post: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }