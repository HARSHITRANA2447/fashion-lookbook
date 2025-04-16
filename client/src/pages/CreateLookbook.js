import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';

const CreateLookbook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    season: '',
    occasion: '',
    tags: '',
    images: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrls) => {
    const newImages = imageUrls.map(url => ({
      url,
      description: '',
      tags: []
    }));
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageDescriptionChange = (index, description) => {
    const updatedImages = [...formData.images];
    updatedImages[index].description = description;
    
    setFormData((prev) => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleImageTagChange = (index, tags) => {
    const updatedImages = [...formData.images];
    updatedImages[index].tags = tags.split(',').map(tag => tag.trim());
    
    setFormData((prev) => ({
      ...prev,
      images: updatedImages
    }));
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const lookbookData = {
        ...formData,
        tags: tagsArray
      };
      
      const response = await api.post('/lookbooks', lookbookData);
      navigate(`/lookbook/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lookbook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Lookbook</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Minimalist, Bohemian"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="All Seasons">All Seasons</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occasion
            </label>
            <input
              type="text"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Casual, Formal, Work"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., denim, vintage, streetwear"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Images
          </label>
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>
        
        {formData.images.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Uploaded Images</h3>
            
            {formData.images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <img
                      src={image.url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="w-full md:w-2/3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Description
                      </label>
                      <input
                        type="text"
                        value={image.description}
                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Describe this look"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={image.tags.join(', ')}
                        onChange={(e) => handleImageTagChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., shoes, accessories"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Lookbook'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLookbook;