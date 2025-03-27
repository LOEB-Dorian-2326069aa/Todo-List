import React from 'react';
import Modal from '../modals/Modal';

function FilterModal({
  categories,
  taskStates,
  tempCategoryFilter,
  setTempCategoryFilter,
  tempStateFilter,
  setTempStateFilter,
  tempUrgencyFilter,
  setTempUrgencyFilter,
  tempDoneFilter,
  setTempDoneFilter,
  tempSortBy,
  setTempSortBy,
  applyAllFilters,
  resetAllFilters,
  setShowModal
}) {
  return (
    <Modal>
      <h2>Filtres et Tri</h2>
      
      <div className="filters-container">
        {/* Section Catégories */}
        <div className="filter-section">
          <h3>Filtrer par catégorie</h3>
          <div className="filter-options">
            {categories.map(category => (
              <div key={category.id} className="filter-option-item">
                <input 
                  type="checkbox" 
                  id={`cat-combined-${category.id}`} 
                  value={category.title}
                  checked={tempCategoryFilter.includes(category.title)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTempCategoryFilter([...tempCategoryFilter, category.title]);
                    } else {
                      setTempCategoryFilter(tempCategoryFilter.filter(cat => cat !== category.title));
                    }
                  }}
                />
                <label htmlFor={`cat-combined-${category.id}`}>{category.title}</label>
              </div>
            ))}
            <div className="filter-option-item">
              <input 
                type="checkbox" 
                id="cat-combined-sans-categorie" 
                value="Sans catégorie"
                checked={tempCategoryFilter.includes('Sans catégorie')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTempCategoryFilter([...tempCategoryFilter, 'Sans catégorie']);
                  } else {
                    setTempCategoryFilter(tempCategoryFilter.filter(cat => cat !== 'Sans catégorie'));
                  }
                }}
              />
              <label htmlFor="cat-combined-sans-categorie">Sans catégorie</label>
            </div>
          </div>
        </div>
        
        {/* Section États */}
        <div className="filter-section">
          <h3>Filtrer par état</h3>
          <div className="filter-options">
            {taskStates.map(state => (
              <div key={state} className="filter-option-item">
                <input 
                  type="checkbox" 
                  id={`state-combined-${state}`}
                  value={state}
                  checked={tempStateFilter.includes(state)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTempStateFilter([...tempStateFilter, state]);
                    } else {
                      setTempStateFilter(tempStateFilter.filter(s => s !== state));
                    }
                  }}
                />
                <label htmlFor={`state-combined-${state}`}>{state}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Section Urgence */}
        <div className="filter-section">
          <h3>Filtrer par urgence</h3>
          <div className="filter-options">
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="urgency-combined-all" 
                name="urgency"
                checked={tempUrgencyFilter === null}
                onChange={() => setTempUrgencyFilter(null)}
              />
              <label htmlFor="urgency-combined-all">Tous</label>
            </div>
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="urgency-combined-urgent" 
                name="urgency"
                checked={tempUrgencyFilter === true}
                onChange={() => setTempUrgencyFilter(true)}
              />
              <label htmlFor="urgency-combined-urgent">Urgent</label>
            </div>
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="urgency-combined-not-urgent" 
                name="urgency"
                checked={tempUrgencyFilter === false}
                onChange={() => setTempUrgencyFilter(false)}
              />
              <label htmlFor="urgency-combined-not-urgent">Non urgent</label>
            </div>
          </div>
        </div>
        
        {/* Section Finalisées */}
        <div className="filter-section">
          <h3>Filtrer par statut</h3>
          <div className="filter-options">
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="done-combined-all" 
                name="done"
                checked={tempDoneFilter === null}
                onChange={() => setTempDoneFilter(null)}
              />
              <label htmlFor="done-combined-all">Tous</label>
            </div>
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="done-combined-yes" 
                name="done"
                checked={tempDoneFilter === true}
                onChange={() => setTempDoneFilter(true)}
              />
              <label htmlFor="done-combined-yes">Finalisées</label>
            </div>
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="done-combined-no" 
                name="done"
                checked={tempDoneFilter === false}
                onChange={() => setTempDoneFilter(false)}
              />
              <label htmlFor="done-combined-no">Pas finalisées</label>
            </div>
          </div>
        </div>
        
        {/* Section Tri */}
        <div className="filter-section">
          <h3>Trier par</h3>
          <div className="filter-options">
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="sort-combined-due-date" 
                name="sort"
                checked={tempSortBy === 'dueDate'}
                onChange={() => setTempSortBy('dueDate')}
              />
              <label htmlFor="sort-combined-due-date">Date d'échéance</label>
            </div>
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="sort-combined-creation-date" 
                name="sort"
                checked={tempSortBy === 'creationDate'}
                onChange={() => setTempSortBy('creationDate')}
              />
              <label htmlFor="sort-combined-creation-date">Date de création</label>
            </div>
            <div className="filter-option-item">
              <input 
                type="radio" 
                id="sort-combined-name" 
                name="sort"
                checked={tempSortBy === 'name'}
                onChange={() => setTempSortBy('name')}
              />
              <label htmlFor="sort-combined-name">Nom</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="filters-actions">
        <button className="btn-apply" onClick={applyAllFilters}>
          Appliquer tous les filtres
        </button>
        <button className="btn-reset" onClick={resetAllFilters}>
          Réinitialiser
        </button>
        <button className="btn-cancel" onClick={() => setShowModal(false)}>
          Annuler
        </button>
      </div>
    </Modal>
  );
}

export default FilterModal;
