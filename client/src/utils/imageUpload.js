import axios from 'axios';

// Upload image to Cloudinary
export const uploadImage = async (file) => {
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'fashion-lookbook'); // Create this preset in Cloudinary
  
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};