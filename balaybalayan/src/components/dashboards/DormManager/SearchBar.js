import React from "react";
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="w-full flex justify-center mt-6 mb-4">
          <div className="relative w-full max-w-md">
          {/* idk how to add the icon (feel free to try) */}
          <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dormers..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );
};

export default SearchBar;