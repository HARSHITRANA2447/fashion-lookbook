import axios from 'axios';

// Get auth token from local storage
const getToken = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
    
  return user ? user.token : null;
};

// Get user by ID
export const getUserById = async (id) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
  return data;
};

// Follow/unfollow a user
export const followUser = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/users/${id}/follow`,
    {},
    config
  );
  
  return data;
};

// Save/unsave a lookbook
export const saveLookbook = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/users/lookbooks/${id}/save`,
    {},
    config
  );
  
  return data;
};

// Get saved lookbooks
export const getSavedLookbooks = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/users/saved/lookbooks`,
    config
  );
  
  return data;
};