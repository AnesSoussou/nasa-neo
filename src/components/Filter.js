/**
 * FilterDropdown Component
 * 
 * This component displays a dropdown menu for filtering Near-Earth Objects (NEOs) 
 * based on the selected orbiting body (e.g., Earth, Mars). 
 * It includes a search bar to filter orbital bodies dynamically, and allows users 
 * to select an orbiting body to filter the displayed NEOs in the chart.
 */


import React, { useState } from "react";

const FilterDropdown = ({ orbitalBodies, selectedOrbit, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false); 

  // Filter orbit options based on the search term
  const filteredBodies = orbitalBodies.filter((body) =>
    body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="w-full bg-blue-500 text-white p-3 rounded flex justify-between items-center"
      >
        {`Orbiting Body (${selectedOrbit || "All"})`}
        <span>{isDropdownOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown menu content*/}
      {isDropdownOpen && (
        <div className="absolute w-full bg-white border rounded shadow mt-2 z-10">
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b"
          />

          <ul className="max-h-40 overflow-y-auto">
            <li
              onClick={() => {
                onFilterChange("");
                setDropdownOpen(false);
              }}
              className={`p-2 cursor-pointer ${
                !selectedOrbit ? "bg-blue-100" : ""
              }`}
            >
              All
            </li>
            {filteredBodies.map((body, index) => (
              <li
                key={index}
                onClick={() => {
                  onFilterChange(body); // Apply the selected filter
                  setDropdownOpen(false);
                }}
                className={`p-2 cursor-pointer ${
                  selectedOrbit === body ? "bg-blue-100" : ""
                }`}
              >
                {body}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
