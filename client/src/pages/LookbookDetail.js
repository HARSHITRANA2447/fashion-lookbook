import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Loader from '../components/Loader';
import Error from '../components/Error';
import CommentSection from '../components/CommentSection';

const LookbookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lookbook, setLookbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLookbook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/lookbooks/${id}`);
        setLookbook(response.data);
        
        // Check if user has liked this lookbook
        if (user) {
          const liked = response.data.likes.includes(user._id);
          setIsLiked(liked);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lookbook');
      } finally {
        setLoading(false);
      }
    };

    fetchLookbook();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/lookbook/${id}` } });
      return;
    }
    
    try {
      const response = await api.post(`/lookbooks/${id}/like`);
      setLookbook(prev => ({
        ...prev,
        likes: response.data.likes
      }));
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to like lookbook:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lookbook?')) {
      return;
    }
    
    try {
      await api.delete(`/lookbooks/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lookbook');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!lookbook) {
    return <Error message="Lookbook not found" />;
  }

  const isOwner = user && lookbook.creator._id === user._id;
  const activeImage = lookbook.images[activeImageIndex];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="w-full lg:w-2/3">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
            <img
              src={activeImage.url}
              alt={activeImage.description || lookbook.title}
              className="w-full h-96 object-contain"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="flex overflow-x-auto gap-2 pb-2">
            {lookbook.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                  index === activeImageIndex ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Details */}
        <div className="w-full lg:w-1/3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{lookbook.title}</h1>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{lookbook.likes.length}</span>
              </button>
            </div>
          </div>
          
          <Link
            to={`/profile/${lookbook.creator.username}`}
            className="flex items-center space-x-2 mb-6"
          >
            <img
              src={lookbook.creator.profilePicture || '/default-avatar.png'}
              alt={lookbook.creator.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700">@{lookbook.creator.username}</span>
          </Link>
          
          <div className="mb-6">
            <p className="text-gray-700">{lookbook.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {lookbook.theme && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Theme</h3>
                <p>{lookbook.theme}</p>
              </div>
            )}
            
            {lookbook.season && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Season</h3>
                <p>{lookbook.season}</p>
              </div>
            )}
            
            {lookbook.occasion && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Occasion</h3>
                <p>{lookbook.occasion}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p>{new Date(lookbook.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {lookbook.tags && lookbook.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lookbook.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {isOwner && (
            <div className="flex space-x-3 mt-8">
              <Link
                to={`/edit-lookbook/${lookbook._id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-white border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Description */}
      {activeImage.description && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">About This Look</h3>
          <p className="text-gray-700">{activeImage.description}</p>
          
          {activeImage.tags && activeImage.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeImage.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Comments Section */}
      <div className="mt-8">
        <CommentSection lookbookId={lookbook._id} comments={lookbook.comments} />
      </div>
    </div>
  );
};

export default LookbookDetail;