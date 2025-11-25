// src/components/SearchUser.jsx
import React, { useState } from "react";

export default function SearchUser({ onSearch }) {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    if (!value) return;
    onSearch(value.trim());
  };

  const onEnter = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter GitHub Username…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onEnter}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
