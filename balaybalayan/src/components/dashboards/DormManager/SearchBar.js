import React from "react";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="dm-search-bar flex items-center gap-4">
      <div className=" auth-button dm-search relative w-full max-w-xs">
        <FaSearch/>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search dormers..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      </div>
    </div>
  );
};

export default SearchBar;
