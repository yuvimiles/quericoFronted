import React, { useState, useRef } from 'react';
import postService from '../services/post-service';
import authService from '../services/auth-service';

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = authService.getCurrentUser();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() && !image) {
      setError('Please add some text or an image');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { request } = postService.createPost({
        text: text.trim(),
        image: image || undefined
      });
      
      const response = await request;
      
      setText('');
      setImage(null);
      setImagePreview(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'An error occurred while creating the post');
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-start mb-4">
        <img 
          src={currentUser?.profileImage || '/default-avatar.jpg'} 
          alt={currentUser?.username || 'User'} 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-2">Create Post</h2>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
              className="w-full border border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
            
            {imagePreview && (
              <div className="relative mb-3">
                <img 
                  src={imagePreview} 
                  alt="Post image" 
                  className="w-full h-auto rounded-md max-h-60 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Add Image
                </button>
              </div>
              
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;