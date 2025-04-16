import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, BookmarkIcon, ChatIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/solid';
import { AuthContext } from '../../context/AuthContext';
import { likeLookbook } from '../../services/lookbookService';
import { saveLookbook } from '../../services/userService';

const LookbookCard = ({ lookbook, onUpdate }) => {
  const { user } = useContext(AuthContext);
  
  const isLiked = user && lookbook.likes && lookbook.likes.includes(user._id);
  const isSaved = user && user.savedLookbooks && user.savedLookbooks.includes(lookbook._id);
  
  const handleLike = async () => {
    if (!user) {
      return;
    }
    
    try {
      await likeLookbook(lookbook._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking lookbook:', error);
    }
  };
  
  const handleSave = async () => {
    if (!user) {
      return;
    }
    
    try {
      await saveLookbook(lookbook._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving lookbook:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <Link to={`/lookbooks/${lookbook._id}`}>
        <div className="aspect-w-4 aspect-h-3">
          <img
            src={lookbook.images && lookbook.images[0] ? lookbook.images[0].url : 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={lookbook.title}
            className="w-full h-64 object-cover"
          />
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <Link to={`/lookbooks/${lookbook._id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{lookbook.title}</h3>
        </Link>
        
        {/* Creator info */}
        <div className="flex items-center mb-3">
          <Link to={`/users/${lookbook.creator._id}`} className="flex items-center">
            <img
              src={lookbook.creator.profilePicture || 'https://via.placeholder.com/40x40?text=User'}
              alt={lookbook.creator.username}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-sm text-gray-600">{lookbook.creator.username}</span>
          </Link>
        </div>
        
        {/* Description */}
        {lookbook.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lookbook.description}</p>
        )}
        
        {/* Tags */}
        {lookbook.tags && lookbook.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lookbook.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {lookbook.tags.length > 3 && (
              <span className="text-gray-500 text-xs px-1 py-1">+{lookbook.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
              disabled={!user}
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5 mr-1" />
              ) : (
                <HeartIcon className="h-5 w-5 mr-1" />
              )}
              <span className="text-sm">{lookbook.likes?.length || 0}</span>
            </button>
            
            <Link
              to={`/lookbooks/${lookbook._id}`}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <ChatIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">{lookbook.comments?.length || 0}</span>
            </Link>
          </div>
          
          <button
            onClick={handleSave}
            className={`${isSaved ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600`}
            disabled={!user}
          >
            {isSaved ? (
              <BookmarkIconSolid className="h-5 w-5" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LookbookCard;