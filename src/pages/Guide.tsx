import React, { useState } from "react";
import { BookOpen, Droplet, Sun, Sprout, ArrowLeft, Search } from "lucide-react";

const Guide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const guideContent: { [key: string]: { title: string; description: string } } = {
    landPreparation: {
      title: "Land Preparation",
      description:
        "Prepare the field by leveling and plowing. Ensure proper drainage and remove weeds to create optimal conditions for paddy growth.",
    },
    seedSelection: {
      title: "Seed Selection",
      description:
        "Choose seeds suitable for the season and desired yield. Opt for high-quality seeds with good germination rates.",
    },
    irrigation: {
      title: "Irrigation",
      description:
        "Maintain adequate water levels in the field. Proper water management is crucial for the healthy growth of paddy crops.",
    },
    harvesting: {
      title: "Harvesting",
      description:
        "Harvest the crop at the right time to ensure maximum yield. Plan for storage or transport immediately after harvesting.",
    },
  };

  const categories = [
    { icon: <Sprout className="h-8 w-8" />, title: "Land Preparation", category: "landPreparation" },
    { icon: <Sun className="h-8 w-8" />, title: "Seed Selection", category: "seedSelection" },
    { icon: <Droplet className="h-8 w-8" />, title: "Irrigation", category: "irrigation" },
    { icon: <BookOpen className="h-8 w-8" />, title: "Harvesting", category: "harvesting" },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paddy Cultivation Guide</h1>

      {/* Search Input */}
      {!selectedCategory && (
        <div className="mb-6 flex items-center gap-4">
          <Search className="text-gray-500 h-6 w-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a guide..."
            className="w-full border p-2 rounded-lg"
          />
        </div>
      )}

      {!selectedCategory ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full"
            >
              <div className="text-green-600 mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{cat.title}</h3>
            </button>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">No matches found for "{searchQuery}".</p>
          )}
        </div>
      ) : (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-2xl font-semibold">{guideContent[selectedCategory].title}</h2>
          <p className="mt-4 text-gray-700">{guideContent[selectedCategory].description}</p>
        </div>
      )}
    </div>
  );
};

export default Guide;
