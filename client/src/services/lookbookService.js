import axios from 'axios';

// Get auth token from local storage
const getToken = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
    
  return user ? user.token : null;
};

// Create a new lookbook
export const createLookbook = async (lookbookData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/lookbooks`,
    lookbookData,
    config
  );
  
  return data;
};

// Get all lookbooks for home feed
export const getLookbooks = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/lookbooks`);
  return data;
};

// Get a single lookbook by ID
export const getLookbookById = async (id) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/lookbooks/${id}`);
  return data;
};

// Update a lookbook
export const updateLookbook = async (id, lookbookData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.put(
    `${process.env.REACT_APP_API_URL}/lookbooks/${id}`,
    lookbookData,
    config
  );
  
  return data;
};

// Delete a lookbook
export const deleteLookbook = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  await axios.delete(`${process.env.REACT_APP_API_URL}/lookbooks/${id}`, config);
};

// Like a lookbook
export const likeLookbook = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/lookbooks/${id}/like`,
    {},
    config
  );
  
  return data;
};

// Comment on a lookbook
export const commentOnLookbook = async (id, text) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  };
  
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/lookbooks/${id}/comment`,
    { text },
    config
  );
  
  return data;
};