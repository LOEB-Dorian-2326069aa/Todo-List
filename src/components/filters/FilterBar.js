import React from 'react';

function FilterBar({ searchQuery, setSearchQuery, openFilterModal, hasActiveFilters }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Rechercher par titre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button 
        onClick={openFilterModal}
        className="filter-button"
      >
        <i className="fas fa-filter"></i> {/* Icône Font Awesome */}
        {hasActiveFilters && (
          <span className="filter-indicator">!</span>
        )}
      </button>
    </div>
  );
}

export default FilterBar;
