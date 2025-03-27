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
 const [viewMode, setViewMode] = useState('tasks'); // Default to tasks view
 const [showFilterModal, setShowFilterModal] = useState(false);
 const [showImportModal, setShowImportModal] = useState(false);
 const [importError, setImportError] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 
 // Filter states
 const [filters, setFilters] = useState({
  category: [],
  state: [],
  urgent: null,
  done: null,
 });
 const [sortBy, setSortBy] = useState('dueDate');
 
 // Temp filter states for modals
 const [tempCategoryFilter, setTempCategoryFilter] = useState([]);
 const [tempStateFilter, setTempStateFilter] = useState([]);
 const [tempUrgencyFilter, setTempUrgencyFilter] = useState(null);
 const [tempDoneFilter, setTempDoneFilter] = useState(null);
 const [tempSortBy, setTempSortBy] = useState('dueDate');

 // Enum for task states
 const TASK_STATES = ['Nouveau', 'En cours', 'Réussi', 'En attente', 'Abandonné'];
 const COMPLETED_STATES = ['Réussi', 'Abandonné'];

 useEffect(() => {
  const storedTasks = localStorage.getItem('tasks');
  const storedCategories = localStorage.getItem('categories');

  if (storedTasks && storedCategories) {
   const parsedTasks = JSON.parse(storedTasks);
   // Ensure all tasks have 'Nouveau' as default state if none is defined
   const tasksWithDefaultState = parsedTasks.map(task => ({
    ...task,
    state: task.state || 'Nouveau'
   }));
   setTasks(tasksWithDefaultState);
   setCategories(JSON.parse(storedCategories));
   
   // Save the updated tasks with default states back to localStorage
   if (JSON.stringify(parsedTasks) !== JSON.stringify(tasksWithDefaultState)) {
    localStorage.setItem('tasks', JSON.stringify(tasksWithDefaultState));
   }
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

 // Open combined filter modal
 const openFilterModal = () => {
   setTempCategoryFilter([...filters.category]);
   setTempStateFilter([...filters.state]);
   setTempUrgencyFilter(filters.urgent);
   setTempDoneFilter(filters.done);
   setTempSortBy(sortBy);
   setShowFilterModal(true);
 };
 
 // Reset filters
 const resetAllFilters = () => {
   setTempCategoryFilter([]);
   setTempStateFilter([]);
   setTempUrgencyFilter(null);
   setTempDoneFilter(null);
   setTempSortBy('dueDate');
 };

 // Apply filters
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

 // Import/export functions
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
       
       if (!importedData.tasks || !Array.isArray(importedData.tasks)) {
         throw new Error('Le format du fichier est invalide. Il doit contenir un tableau "tasks".');
       }
       
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

 // Filter tasks based on filters and search
 const filteredTasks = tasks
  .filter(task => {
   // Search filter
   if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
     return false;
   }
   
   // Default view filter
   if (viewMode === 'tasks' && 
       filters.category.length === 0 && 
       filters.state.length === 0 && 
       filters.urgent === null && 
       filters.done === null) {
     return !COMPLETED_STATES.includes(task.state);
   }
   
   // Apply other filters
   if (filters.category.length && !filters.category.includes(task.category)) return false;
   if (filters.state.length && !filters.state.includes(task.state)) return false;
   if (filters.urgent !== null && task.urgent !== filters.urgent) return false;
   if (filters.done !== null && task.done !== filters.done) return false;
   return true;
  })
  .sort((a, b) => {
   if (sortBy === 'dueDate') return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
   if (sortBy === 'creationDate') return new Date(a.creationDate) - new Date(b.creationDate);
   if (sortBy === 'name') return a.title.localeCompare(b.title);
   return 0;
  });

 // Group tasks by category for category view
 const tasksByCategory = {};
 categories.forEach(category => {
   tasksByCategory[category.title] = filteredTasks.filter(
     task => task.category === category.title
   );
 });
 
 // Make sure "Sans catégorie" is included
 tasksByCategory['Sans catégorie'] = filteredTasks.filter(task => 
   task.category === 'Sans catégorie' || !task.category
 );

 return (
  <div>
    <Header 
      tasks={tasks} 
      taskStates={TASK_STATES} 
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
        tasksByCategory={tasksByCategory}
        viewMode={viewMode}
        deleteTask={deleteTask}
        finalizeTask={finalizeTask}
        editTask={editTask}
      />
    </main>

    <Footer 
      setShowTaskModal={setShowTaskModal} 
      setShowCategoryModal={setShowCategoryModal}
      viewMode={viewMode}
      setViewMode={setViewMode}
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
