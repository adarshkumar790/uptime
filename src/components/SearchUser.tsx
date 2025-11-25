import React, { useState } from "react";

interface SearchUserProps {
  onSearch: (username: string) => void;
}

export default function SearchUser({ onSearch }: SearchUserProps) {
  const [value, setValue] = useState<string>("");

  const handleSearch = () => {
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
