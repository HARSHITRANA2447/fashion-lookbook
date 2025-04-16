import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ImageUpload = ({ onImageUpload }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // We'll use Cloudinary for image upload
      // In a real application, you would use the Cloudinary API or a server endpoint
      
      // For demonstration, we'll simulate the upload
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append('images', file);
      });
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        }
      });
      
      onImageUpload(response.data.urls);
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };
  
  // For the sake of this example, let's assume we're mocking the upload
  // In a real application, you'd implement proper upload functionality
  const mockUpload = () => {
    setUploading(true);
    setError(null);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        
        // Generate mock URLs
        const mockUrls = files.map((file, index) => 
          `https://example.com/mock-image-${index + 1}.jpg`
        );
        
        onImageUpload(mockUrls);
        setFiles([]);
      }
    }, 300);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 mb-1">
            Drag and drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG or GIF (max. 5MB per image)
          </p>
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </p>
          
          <ul className="text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index} className="truncate">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
          
          {uploading ? (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-right">
                {uploadProgress}%
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={mockUpload} // In real app, use handleUpload
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;