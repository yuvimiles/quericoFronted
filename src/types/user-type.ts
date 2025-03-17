// הגדרת ממשק למשתמש לפי המבנה הקיים
export interface User {
    id: string; // mongoose.Types.ObjectId
    name: string;
    email: string;
    password: string;
    profileImage: string;
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
    name?: string;
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
    author:{
      _id?: string;
      name?: string;
      profileImage?: string;
    }; // IUser['_id']
    post: string; // IPost['_id']
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // ממשק מורחב לתגובה עם פרטי המשתמש המגיב