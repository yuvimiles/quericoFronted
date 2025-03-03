export interface User {
    _id: string; // mongoose.Types.ObjectId
    username: string;
    email: string;
    password: string;
    profileImage: string;
    googleId?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
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