import { useEffect, useState } from 'react';
import './style.css';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import CategoryForm from './components/categories/CategoryForm';
import FilterBar from './components/filters/FilterBar';
import FilterModal from './components/filters/FilterModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ImportExportModal from './components/modals/ImportExportModal';

function App() {
 const [tasks, setTasks] = useState([]);
 const [categories, setCategories] = useState([]);
 const [showTaskModal, setShowTaskModal] = useState(false);
 const [showCategoryModal, setShowCategoryModal] = useState(false);
 const [editTaskId, setEditTaskId] = useState(null);
 const [showEditModal, setShowEditModal] = useState(false);
 const [showFilterModal, setShowFilterModal] = useState(false);
 const [showImportModal, setShowImportModal] = useState(false);
 const [importError, setImportError] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 
 // États des filtres
 const [filters, setFilters] = useState({
  category: [],
  state: [],
  urgent: null,
  done: null,
 });
 const [sortBy, setSortBy] = useState('dueDate');
 
 // États temporaires pour les filtres dans les modals
 const [tempCategoryFilter, setTempCategoryFilter] = useState([]);
 const [tempStateFilter, setTempStateFilter] = useState([]);
 const [tempUrgencyFilter, setTempUrgencyFilter] = useState(null);
 const [tempDoneFilter, setTempDoneFilter] = useState(null);
 const [tempSortBy, setTempSortBy] = useState('dueDate');

 // Enumération des états des tâches
 const TASK_STATES = ['Nouveau', 'En cours', 'Réussi', 'En attente', 'Abandonné'];
 const COMPLETED_STATES = ['Réussi', 'Abandonné'];

 useEffect(() => {
  const storedTasks = localStorage.getItem('tasks');
  const storedCategories = localStorage.getItem('categories');
  const storedRelations = localStorage.getItem('relations'); // Ajout pour les relations

  if (storedTasks && storedCategories) {
    const parsedTasks = JSON.parse(storedTasks);
    const parsedCategories = JSON.parse(storedCategories);
    const parsedRelations = storedRelations ? JSON.parse(storedRelations) : []; // Charger les relations

    // Associer les tâches à leurs catégories via les relations
    const tasksWithCategories = parsedTasks.map(task => {
      const relation = parsedRelations.find(rel => rel.tache === task.id);
      const category = relation ? parsedCategories.find(cat => cat.id === relation.categorie) : null;
      return {
        ...task,
        category: category ? category.title : 'Sans catégorie'
      };
    });

    setTasks(tasksWithCategories);
    setCategories(parsedCategories);

    // Sauvegarder les tâches mises à jour dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(tasksWithCategories));
  }
}, []);

useEffect(() => {
  const storedRelations = localStorage.getItem('relations');
  if (!storedRelations) {
    const initialRelations = [
      { tache: 102, categorie: 201 },
      { tache: 108, categorie: 201 },
      { tache: 109, categorie: 203 },
      { tache: 105, categorie: 202 },
      { tache: 106, categorie: 202 }
    ];
    localStorage.setItem('relations', JSON.stringify(initialRelations));
  }
}, []);

 const saveToLocalStorage = (tasks, categories) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('categories', JSON.stringify(categories));
 };

 const addTask = (newTask) => {
  const updatedTasks = [...tasks, newTask];
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
  setShowTaskModal(false);
 };

 const addCategory = (newCategory) => {
  const updatedCategories = [...categories, newCategory];
  setCategories(updatedCategories);
  saveToLocalStorage(tasks, updatedCategories);
  setShowCategoryModal(false);
 };

 const deleteTask = (id) => {
  const updatedTasks = tasks.filter(task => task.id !== id);
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
 };

 const finalizeTask = (id) => {
  const updatedTasks = tasks.map(task => {
    if (task.id === id) {
      if (!task.done) {
        return { 
          ...task, 
          done: true, 
          previousState: task.state,
          state: 'Réussi' 
        };
      } else {
        return { 
          ...task, 
          done: false,
          state: task.previousState || task.state 
        };
      }
    }
    return task;
  });
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
 };

 const editTask = (task) => {
  setEditTaskId(task.id);
  setShowEditModal(true);
 };

 const saveEditedTask = (editedTask) => {
  const updatedTasks = tasks.map(task => 
   task.id === editedTask.id ? editedTask : task 
  );
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
  setShowEditModal(false);
 };

 const changeTaskState = (id, newState) => {
  const updatedTasks = tasks.map(task =>
   task.id === id ? { ...task, state: newState } : task 
  );
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
 };

 // Ouvrir le modal de filtres combinés
 const openFilterModal = () => {
   setTempCategoryFilter([...filters.category]);
   setTempStateFilter([...filters.state]);
   setTempUrgencyFilter(filters.urgent);
   setTempDoneFilter(filters.done);
   setTempSortBy(sortBy);
   setShowFilterModal(true);
 };

 // Réinitialiser les filtres
 const resetAllFilters = () => {
   setTempCategoryFilter([]);
   setTempStateFilter([]);
   setTempUrgencyFilter(null);
   setTempDoneFilter(null);
   setTempSortBy('dueDate');
 };

 // Appliquer les filtres
 const applyAllFilters = () => {
   setFilters({
     category: tempCategoryFilter,
     state: tempStateFilter,
     urgent: tempUrgencyFilter,
     done: tempDoneFilter
   });
   setSortBy(tempSortBy);
   setShowFilterModal(false);
 };

 // Fonctions d'import/export
 const exportToJson = () => {
   const data = {
     tasks: tasks,
     categories: categories
   };
   const jsonString = JSON.stringify(data, null, 2);
   const blob = new Blob([jsonString], { type: 'application/json' });
   const href = URL.createObjectURL(blob);
   const link = document.createElement('a');
   link.href = href;
   link.download = `todo-app-export-${new Date().toISOString().slice(0, 10)}.json`;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(href);
 };

 const importFromJson = (event) => {
  setImportError('');
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Vérifier si le format est avec "tasks" ou avec "taches"
      if (importedData.taches && Array.isArray(importedData.taches)) {
        // Convertir le format "taches" en "tasks"
        importedData.tasks = importedData.taches.map(task => ({
          id: task.id,
          title: task.title || task.nom,
          description: task.description,
          dueDate: task.date_echeance || task.dateEcheance,
          done: task.done,
          urgent: task.urgent,
          state: task.etat || 'Nouveau',
          category: task.categorie || 'Sans catégorie'
        }));
      } else if (!importedData.tasks || !Array.isArray(importedData.tasks)) {
        throw new Error('Le format du fichier est invalide. Il doit contenir un tableau "tasks" ou "taches".');
      }

      // Vérifier les catégories
      if (!importedData.categories || !Array.isArray(importedData.categories)) {
        throw new Error('Le format du fichier est invalide. Il doit contenir un tableau "categories".');
      }
      
      setTasks(importedData.tasks);
      setCategories(importedData.categories);
      saveToLocalStorage(importedData.tasks, importedData.categories);
      setShowImportModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      setImportError('Erreur lors de l\'importation: ' + error.message);
    }
  };
  reader.readAsText(file);
 };

 // Filtrer les tâches en fonction des filtres et de la recherche
 const filteredTasks = tasks
  .filter(task => {
   // Filtre de recherche
   if (searchQuery.length > 0 && searchQuery.length < 3) {
     return false;
   }
   if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
     return false;
   }
   
   // Appliquer les autres filtres
   if (filters.category.length && !filters.category.includes(task.category)) return false;
   if (filters.state.length && !filters.state.includes(task.state)) return false;
   if (filters.urgent !== null && task.urgent !== filters.urgent) return false;
   if (filters.done !== null && task.done !== filters.done) return false;
   return true;
  })
  .sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999')); // Tri par date d'échéance
 
 return (
  <div>
    <Header 
      tasks={tasks} 
      taskStates={TASK_STATES} 
      setSearchQuery={setSearchQuery} 
      openFilterModal={openFilterModal} 
      hasActiveFilters={filters.category.length > 0 || filters.state.length > 0 || filters.urgent !== null || filters.done !== null} 
    />

    <main>
      <h1>Liste des Tâches</h1>
      
      <FilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        openFilterModal={openFilterModal} 
        hasActiveFilters={filters.category.length > 0 || filters.state.length > 0 || filters.urgent !== null || filters.done !== null} 
      />
      
      <TaskList 
        tasks={filteredTasks}
        deleteTask={deleteTask}
        finalizeTask={finalizeTask}
        editTask={editTask}
      />
    </main>

    <Footer 
      setShowTaskModal={setShowTaskModal} 
      setShowCategoryModal={setShowCategoryModal}
      exportToJson={exportToJson}
      setShowImportModal={setShowImportModal}
    />

    {/* Modals */}
    {showTaskModal && (
      <TaskForm 
        categories={categories}
        addTask={addTask}
        setShowModal={setShowTaskModal}
        taskStates={TASK_STATES}
      />
    )}

    {showCategoryModal && (
      <CategoryForm 
        addCategory={addCategory}
        setShowModal={setShowCategoryModal}
      />
    )}

    {showEditModal && (
      <TaskForm 
        isEditing={true}
        editTaskId={editTaskId}
        task={tasks.find(task => task.id === editTaskId)}
        categories={categories}
        saveTask={saveEditedTask}
        setShowModal={setShowEditModal}
        taskStates={TASK_STATES}
      />
    )}

    {showFilterModal && (
      <FilterModal 
        categories={categories}
        taskStates={TASK_STATES}
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

    {showImportModal && (
      <ImportExportModal 
        importFromJson={importFromJson}
        importError={importError}
        setShowModal={setShowImportModal}
      />
    )}
  </div>
 );
}

export default App;