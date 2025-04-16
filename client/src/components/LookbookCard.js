import React from 'react';
import { Link } from 'react-router-dom';

const LookbookCard = ({ lookbook }) => {
  const { _id, title, creator, images, likes } = lookbook;
  
  // Get the first image as cover
  const coverImage = images && images.length > 0 ? images[0].url : '/placeholder-image.jpg';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/lookbook/${_id}`}>
        <div className="h-64 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/lookbook/${_id}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 mb-1">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${creator.username}`}
            className="flex items-center space-x-2"
          >
            <img
              src={creator.profilePicture || '/default-avatar.png'}
              alt={creator.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">@{creator.username}</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-600">{likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookbookCard;