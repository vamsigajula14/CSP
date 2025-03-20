import React, { useEffect, useState } from "react";
import { BookOpen, Droplet, Scaling as Seedling, Sun } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Guide as GuideType } from "../lib/supabase";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

function Guide() {
  const [guides, setGuides] = useState<GuideType[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    try {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      toast.error("Error fetching guides");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    {
      icon: <Seedling className="h-8 w-8" />,
      title: "Land Preparation",
      description: "Learn about proper soil preparation techniques",
      category: "land-preparation",
      question: "Have you tested your soil quality?",
    },
    {
      icon: <Sun className="h-8 w-8" />,
      title: "Seed Selection",
      description: "Choose the right paddy varieties for your region",
      category: "seed-selection",
      question: "What type of seed are you planning to use?",
    },
    {
      icon: <Droplet className="h-8 w-8" />,
      title: "Irrigation",
      description: "Water management best practices",
      category: "irrigation",
      question: "How many days ago did you last irrigate?",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Harvesting",
      description: "When and how to harvest your crop",
      category: "harvesting",
      question: "Do you have the required tools for harvesting?",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInputs({
      ...userInputs,
      [selectedGuide?.category || ""]: e.target.value,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Paddy Cultivation Guide
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <GuideCard
            key={cat.category}
            {...cat}
            onClick={() => {
              const guide = guides.find((g) => g.category === cat.category);
              setSelectedGuide(guide || null);
            }}
          />
        ))}
      </div>

      {loading ? (
        <div className="mt-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading guides...</p>
        </div>
      ) : selectedGuide ? (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{selectedGuide.title}</h2>
            <button
              onClick={() => setSelectedGuide(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* User Input Section */}
          <div className="mb-4">
            <p className="text-lg font-medium">
              {
                categories.find((c) => c.category === selectedGuide.category)
                  ?.question
              }
            </p>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              value={userInputs[selectedGuide.category] || ""}
              onChange={handleInputChange}
              placeholder="Enter your answer..."
            />
          </div>

          <div className="prose max-w-none">
            <ReactMarkdown>{selectedGuide.content}</ReactMarkdown>
          </div>
        </div>
      ) : guides.length > 0 ? (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Featured Guide: {guides[0].title}
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{guides[0].content}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          No guides available at the moment.
        </div>
      )}
    </div>
  );
}

function GuideCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full"
    >
      <div className="text-green-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}

export default Guide;
