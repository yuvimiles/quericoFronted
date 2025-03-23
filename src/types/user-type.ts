// הגדרת ממשק למשתמש לפי המבנה הקיים
export interface User {
    _id: string; // mongoose.Types.ObjectId
    id?: string;
    name: string;
    email: string;
    password: string;
    profileImage: string;
    googleId?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
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