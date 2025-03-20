import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Users, Cloud, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8" />
            <span className="font-bold text-xl">PaddyGuide</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/guide" className="flex items-center space-x-1 hover:text-green-200">
              <BookOpen className="h-5 w-5" />
              <span>Cultivation Guide</span>
            </Link>
            <Link to="/community" className="flex items-center space-x-1 hover:text-green-200">
              <Users className="h-5 w-5" />
              <span>Community</span>
            </Link>
            <Link to="/weather" className="flex items-center space-x-1 hover:text-green-200">
              <Cloud className="h-5 w-5" />
              <span>Weather</span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{profile?.full_name}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;