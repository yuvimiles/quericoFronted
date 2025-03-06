import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService, { PostWithAuthor, PostUpdateData } from '../services/post-service';
import authService from '../services/auth-service';

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    if (!postId) {
      navigate('/');
      return;
    }
    
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { request } = postService.getPostById(postId);
        const response = await request;
        const postData = response.data;
        
        // Check if current user is the author
        if (!currentUser || currentUser._id !== postData.author._id) {
          setError("You don't have permission to edit this post");
          return;
        }
        
        setPost(postData);
        setText(postData.text);
        
        if (postData.image) {
          setImagePreview(postData.image);
        }
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, navigate, currentUser]);
  
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
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postId) return;
    
    if (!text.trim() && !image && !imagePreview) {
      setError('Please add some text or an image');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const updateData: PostUpdateData = {
        text: text.trim(),
      };
      
      if (image) {
        updateData.image = image;
      }
      
      const { request } = postService.updatePost(postId, updateData);
      await request;
      
      navigate(`/post/${postId}`);
    } catch (err: any) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/post/${postId}`);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error && !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-blue-500 hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                disabled={submitting}
              />
            </div>
            
            {imagePreview && (
              <div className="relative mb-4">
                <img 
                  src={imagePreview} 
                  alt="Post image" 
                  className="w-full h-auto rounded-md max-h-96 object-cover"
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
            
            <div className="flex items-center justify-between">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                  disabled={submitting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  {imagePreview ? 'Change Image' : 'Add Image'}
                </button>
              </div>
              
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;