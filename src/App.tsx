import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Guide from './pages/Guide';
import Community from './pages/Community';
import Weather from './pages/Weather';
import Login from './pages/Login';
import ForumPage from "./pages/ForumPage";
import PostPage from "./pages/PostPage";
import PaddyGuide from "./components/PaddyGuide";


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider> {/* Ensure it wraps everything */}
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/community" element={<Community />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/:postId" element={<PostPage />} />
              <Route path="/guide" element={<PaddyGuide />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}



export default App;