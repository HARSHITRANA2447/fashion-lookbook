import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LookbookCard from '../components/LookbookCard';
import Loader from '../components/Loader';
import Error from '../components/Error';

const Home = () => {
  const [lookbooks, setLookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchLookbooks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/lookbooks?page=${page}`);
        
        if (page === 1) {
          setLookbooks(response.data.lookbooks);
        } else {
          setLookbooks((prev) => [...prev, ...response.data.lookbooks]);
        }
        
        setHasMore(page < response.data.pages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lookbooks');
      } finally {
        setLoading(false);
      }
    };

    fetchLookbooks();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Fashion Lookbook</h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover the latest fashion trends and styles from around the world
        </p>
        <Link 
          to="/create-lookbook"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Create Your Lookbook
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {lookbooks.map((lookbook) => (
          <LookbookCard key={lookbook._id} lookbook={lookbook} />
        ))}
      </div>

      {loading && <Loader />}

      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;