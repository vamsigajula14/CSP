import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
=======
import { Search, ArrowRight } from 'lucide-react';
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
import { useNavigate } from 'react-router-dom';
import { supabase, Guide } from '../lib/supabase';
import toast from 'react-hot-toast';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>([]);
<<<<<<< HEAD
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [isSearching, setIsSearching] = useState(false);
=======
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    try {
      const { data, error } = await supabase
        .from('guides')
<<<<<<< HEAD
        .select('*');

      if (error) throw error;
      setGuides(data || []);
      setFilteredGuides(data || []); // Initialize filtered guides
=======
        .select('*')
        .limit(3);

      if (error) throw error;
      setGuides(data || []);
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  }

<<<<<<< HEAD
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);

    if (query.trim() === '') {
      setFilteredGuides(guides);
    } else {
      setFilteredGuides(
        guides.filter(
          (guide) =>
            guide.title.toLowerCase().includes(query.toLowerCase()) ||
            guide.content.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleResultClick = (id: string) => {
    setSearchQuery('');
    setIsSearching(false);
    navigate(`/guide?id=${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
=======
  const handleSearch = (e: React.FormEvent) => {
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    navigate(`/guide?search=${encodeURIComponent(searchQuery)}`);
  };

  const quickLinks = [
    {
<<<<<<< HEAD
      title: 'Ask an Expert',
      description: 'Get personalized advice from agricultural experts',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=500',
      link: '/community',
    },
    {
      title: 'Weather Updates',
      description: 'Check real-time weather forecasts for your region',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=500',
      link: '/weather',
    },
    {
      title: 'Cultivation Guides',
      description: 'Access comprehensive paddy farming guides',
      image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=500',
      link: '/guide',
    },
=======
      title: "Ask an Expert",
      description: "Get personalized advice from agricultural experts",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=500",
      link: "/community"
    },
    {
      title: "Weather Updates",
      description: "Check real-time weather forecasts for your region",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=500",
      link: "/weather"
    },
    {
      title: "Cultivation Guides",
      description: "Access comprehensive paddy farming guides",
      image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=500",
      link: "/guide"
    }
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Expert Paddy Cultivation Guidance
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get comprehensive advice and support for successful paddy farming
        </p>
        <div className="max-w-2xl mx-auto">
<<<<<<< HEAD
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-lg shadow-md p-2">
            <SearchIcon className="h-6 w-6 text-gray-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
=======
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg shadow-md p-2">
            <Search className="h-6 w-6 text-gray-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
              placeholder="Search for farming advice..."
              className="flex-1 px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Search
            </button>
<<<<<<< HEAD

            {/* Search Results */}
            {isSearching && searchQuery && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(guide.id)}
                    >
                      <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                      <p className="text-sm text-gray-600">
                        {guide.content.substring(0, 100)}...
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-600">No results found for "{searchQuery}".</p>
                )}
              </div>
            )}
=======
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
          </form>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {quickLinks.map((link, index) => (
          <QuickLinkCard
            key={index}
            {...link}
            onClick={() => navigate(link.link)}
          />
        ))}
      </div>

      {/* Featured Guides */}
      {guides.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3">{guide.title}</h3>
                <p className="text-gray-600 mb-4">
                  {guide.content.substring(0, 150)}...
                </p>
                <button
                  onClick={() => navigate(`/guide?id=${guide.id}`)}
                  className="text-green-600 hover:text-green-700 flex items-center"
                >
                  Read More <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  image,
<<<<<<< HEAD
  onClick,
=======
  onClick
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
}: {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow text-left w-full"
    >
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-green-600 hover:text-green-700">
          Learn More <ArrowRight className="h-4 w-4 ml-2" />
        </div>
      </div>
    </button>
  );
}

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
