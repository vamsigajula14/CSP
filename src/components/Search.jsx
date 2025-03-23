import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-white rounded-lg shadow-md p-2"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for farming advice..."
        className="flex-1 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
