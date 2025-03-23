import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import { AuthProvider } from "./contexts/AuthContext";
=======
import { AuthProvider } from './contexts/AuthContext';
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Guide from './pages/Guide';
import Community from './pages/Community';
import Weather from './pages/Weather';
import Login from './pages/Login';
<<<<<<< HEAD
import ForumPage from "./pages/ForumPage";
import PostPage from "./pages/PostPage";
import PaddyGuide from "./components/PaddyGuide";

=======
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c

function App() {
  return (
    <ErrorBoundary>
<<<<<<< HEAD
      <AuthProvider> {/* Ensure it wraps everything */}
=======
      <AuthProvider>
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/community" element={<Community />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/login" element={<Login />} />
<<<<<<< HEAD
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/:postId" element={<PostPage />} />
              <Route path="/guide" element={<PaddyGuide />} />
=======
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

<<<<<<< HEAD


=======
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
export default App;