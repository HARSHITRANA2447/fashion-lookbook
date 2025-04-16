import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { SearchIcon, MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${searchQuery}`);
      setSearchQuery('');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Fashion Lookbook
            </Link>
          </div>
          
          {/* Search form - Desktop */}
          <div className="hidden md:flex items-center w-1/3">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lookbooks..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/discover" className="text-gray-600 hover:text-indigo-600">
              Discover
            </Link>
            
            {user ? (
              <>
                <Link to="/lookbooks/create" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                  Create Lookbook
                </Link>
                
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </Menu.Button>
                  
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Menu.Item>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          to="/saved"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Saved Lookbooks
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lookbooks..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </form>
            
            <nav className="flex flex-col space-y-2">
              <Link
                to="/discover"
                className="text-gray-600 hover:text-indigo-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/lookbooks/create"
                    className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Lookbook
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-indigo-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved"
                    className="text-gray-600 hover:text-indigo-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Saved Lookbooks
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-indigo-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;