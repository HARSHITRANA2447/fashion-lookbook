import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routes/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CreateLookbook from './pages/CreateLookbook';
import LookbookDetail from './pages/LookbookDetail';
import Discover from './pages/Discover';
import UserProfile from './pages/UserProfile';
import SavedLookbooks from './pages/SavedLookbooks';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="min-h-screen py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/profile/edit" element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            } />
            <Route path="/lookbooks/create" element={
              <PrivateRoute>
                <CreateLookbook />
              </PrivateRoute>
            } />
            <Route path="/lookbooks/:id" element={<LookbookDetail />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/saved" element={
              <PrivateRoute>
                <SavedLookbooks />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;