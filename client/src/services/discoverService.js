import axios from 'axios';

// Get auth token from local storage
const getToken = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
    
  return user ? user.token : null;
};

// Get trending lookbooks
export const getTrendingLookbooks = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/discover/trending`);
  return data;
};

// Get recommended lookbooks (requires auth)
export const getRecommendedLookbooks = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/discover/recommended`,
    config
  );
  
  return data;
};

// Search lookbooks
export const searchLookbooks = async (params) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/discover/search`, {
    params
  });
  
  return data;
};