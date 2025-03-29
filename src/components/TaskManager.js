import React, { useState, useEffect } from 'react';
import FilterModal from './filters/FilterModal';

function TaskManager() {
  const [categories, setCategories] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskStates, setTaskStates] = useState([]);
  const [tempCategoryFilter, setTempCategoryFilter] = useState([]);
  const [tempStateFilter, setTempStateFilter] = useState([]);
  const [tempUrgencyFilter, setTempUrgencyFilter] = useState(null);
  const [tempDoneFilter, setTempDoneFilter] = useState(null);
  const [tempSortBy, setTempSortBy] = useState('dueDate');
  const [categoryFilter, setCategoryFilter] = useState([]);

  // Charger les catégories du localStorage au démarrage
  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);
  
  // Sauvegarder les catégories dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const resetAllFilters = () => {
    setTempCategoryFilter([]);
    setTempStateFilter([]);
    setTempUrgencyFilter(null);
    setTempDoneFilter(null);
    setTempSortBy('dueDate');
  };
  
  const applyAllFilters = () => {
  };

  return (
    <div className="task-manager">
      <button onClick={() => setShowFilterModal(true)}>Open Filter Modal</button>
      
      {showFilterModal && (
        <FilterModal
          categories={categories}
          taskStates={taskStates}
          tempCategoryFilter={tempCategoryFilter}
          setTempCategoryFilter={setTempCategoryFilter}
          tempStateFilter={tempStateFilter}
          setTempStateFilter={setTempStateFilter}
          tempUrgencyFilter={tempUrgencyFilter}
          setTempUrgencyFilter={setTempUrgencyFilter}
          tempDoneFilter={tempDoneFilter}
          setTempDoneFilter={setTempDoneFilter}
          tempSortBy={tempSortBy}
          setTempSortBy={setTempSortBy}
          applyAllFilters={applyAllFilters}
          resetAllFilters={resetAllFilters}
          setShowModal={setShowFilterModal}
        />
      )}
    </div>
  );
}

export default TaskManager;