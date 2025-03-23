import React, { useState, useEffect } from "react";

// Define TypeScript types
export interface GuideDetail {
  fieldName: string;
  description: string;
}

interface Props {
  // Props if you want to pass pre-fetched data
  initialData?: GuideDetail[];
}

const PaddyGuide: React.FC<Props> = ({ initialData }) => {
  const [guideData, setGuideData] = useState<GuideDetail[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Fetch data from API or use initialData
  useEffect(() => {
    if (initialData) {
      setGuideData(initialData);
    } else {
      fetch("/api/paddy-guide")
        .then((response) => response.json())
        .then((data: GuideDetail[]) => setGuideData(data))
        .catch((error) => console.error("Error fetching guide data:", error));
    }
  }, [initialData]);

  const handleFieldClick = (fieldName: string) => {
    setSelectedField(fieldName);
  };

  const selectedGuide = guideData.find((guide) => guide.fieldName === selectedField);

  return (
    <div className="paddy-guide">
      <h2 className="text-xl font-bold mb-4">Paddy Cultivation Guide</h2>
      <div className="guide-fields space-y-2">
        {guideData.map((guide) => (
          <button
            key={guide.fieldName}
            className="w-full text-left p-3 border rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => handleFieldClick(guide.fieldName)}
          >
            {guide.fieldName}
          </button>
        ))}
      </div>

      {selectedGuide && (
        <div className="field-details mt-6 p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">{selectedGuide.fieldName}</h3>
          <p>{selectedGuide.description}</p>
          <button
            className="mt-4 text-blue-500 underline"
            onClick={() => setSelectedField(null)}
          >
            Back to Fields
          </button>
        </div>
      )}
    </div>
  );
};

export default PaddyGuide;
