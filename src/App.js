import { useEffect, useState } from 'react';
import './style.css';

function App() {
 const [tasks, setTasks] = useState([]);
 const [categories, setCategories] = useState([]);
 const [newTaskTitle, setNewTaskTitle] = useState('');
 const [newTaskCategory, setNewTaskCategory] = useState('');
 const [newTaskPriority, setNewTaskPriority] = useState('Moyenne');
 const [newTaskDueDate, setNewTaskDueDate] = useState('');
 const [newTaskState, setNewTaskState] = useState('Nouveau');
 const [newTaskDescription, setNewTaskDescription] = useState(''); // New state for task description
 const [newCategoryTitle, setNewCategoryTitle] = useState('');
 const [newCategoryColor, setNewCategoryColor] = useState('#ffa064'); // Ajout d'un état pour la couleur
 const [showTaskModal, setShowTaskModal] = useState(false);
 const [showCategoryModal, setShowCategoryModal] = useState(false);
 const [editTaskId, setEditTaskId] = useState(null);
 const [editTaskTitle, setEditTaskTitle] = useState('');
 const [editTaskPriority, setEditTaskPriority] = useState('Moyenne');
 const [editTaskDueDate, setEditTaskDueDate] = useState('');
 const [editTaskCategory, setEditTaskCategory] = useState('');
 const [editTaskState, setEditTaskState] = useState(''); // Nouvel état pour stocker l'état de la tâche en modification
 const [editTaskDescription, setEditTaskDescription] = useState(''); // New state for editing description
 const [showEditModal, setShowEditModal] = useState(false);
 const [filters, setFilters] = useState({
  category: [],
  state: [],
  urgent: null,
  done: null,
 });
 const [sortBy, setSortBy] = useState('dueDate'); // Options: 'creationDate', 'dueDate', 'name'
 const [viewMode, setViewMode] = useState('tasks'); // Default to tasks view

 const [showCategoryFilterModal, setShowCategoryFilterModal] = useState(false);
 const [showStateFilterModal, setShowStateFilterModal] = useState(false);
 const [showUrgencyFilterModal, setShowUrgencyFilterModal] = useState(false);
 const [showDoneFilterModal, setShowDoneFilterModal] = useState(false);
 const [showSortModal, setShowSortModal] = useState(false);
 const [showImportModal, setShowImportModal] = useState(false);
 const [importError, setImportError] = useState('');
 
 const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la recherche
 
 // Temporary filter states for modals
 const [tempCategoryFilter, setTempCategoryFilter] = useState([]);
 const [tempStateFilter, setTempStateFilter] = useState([]);
 const [tempUrgencyFilter, setTempUrgencyFilter] = useState(null);
 const [tempDoneFilter, setTempDoneFilter] = useState(null);
 const [tempSortBy, setTempSortBy] = useState('dueDate');
 const [showFilterModal, setShowFilterModal] = useState(false); // Nouvel état pour le modal combiné
 
 // Initialize temp filters when opening modals
 const openCategoryFilterModal = () => {
   setTempCategoryFilter([...filters.category]);
   setShowCategoryFilterModal(true);
 };
 
 const openStateFilterModal = () => {
   setTempStateFilter([...filters.state]);
   setShowStateFilterModal(true);
 };
 
 const openUrgencyFilterModal = () => {
   setTempUrgencyFilter(filters.urgent);
   setShowUrgencyFilterModal(true);
 };
 
 const openDoneFilterModal = () => {
   setTempDoneFilter(filters.done);
   setShowDoneFilterModal(true);
 };
 
 const openSortModal = () => {
   setTempSortBy(sortBy);
   setShowSortModal(true);
 };
 
 // Function to open the combined filter modal
 const openFilterModal = () => {
   // Initialize all temp filter states
   setTempCategoryFilter([...filters.category]);
   setTempStateFilter([...filters.state]);
   setTempUrgencyFilter(filters.urgent);
   setTempDoneFilter(filters.done);
   setTempSortBy(sortBy);
   setShowFilterModal(true);
 };
 
 // Nouvelle fonction pour réinitialiser tous les filtres
 const resetAllFilters = () => {
   setTempCategoryFilter([]);
   setTempStateFilter([]);
   setTempUrgencyFilter(null);
   setTempDoneFilter(null);
   setTempSortBy('dueDate');
 };

 // Apply filter functions
 const applyCategoryFilter = () => {
   setFilters({ ...filters, category: tempCategoryFilter });
   setShowCategoryFilterModal(false);
 };
 
 const applyStateFilter = () => {
   setFilters({ ...filters, state: tempStateFilter });
   setShowStateFilterModal(false);
 };
 
 const applyUrgencyFilter = () => {
   setFilters({ ...filters, urgent: tempUrgencyFilter });
   setShowUrgencyFilterModal(false);
 };
 
 const applyDoneFilter = () => {
   setFilters({ ...filters, done: tempDoneFilter });
   setShowDoneFilterModal(false);
 };
 
 const applySortFilter = () => {
   setSortBy(tempSortBy);
   setShowSortModal(false);
 };
 
 // Apply all filters at once
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

 const addTask = () => {
  if (!newTaskTitle || newTaskTitle.length < 3) return;
  const newTask = {
    id: Date.now(),
    title: newTaskTitle,
    description: newTaskDescription, // Include the description
    done: false,
    priority: newTaskPriority,
    category: newTaskCategory || 'Sans catégorie',
    urgent: false, // Assurez-vous que cette valeur est false par défaut
    state: newTaskState,
    creationDate: new Date().toISOString(),
    dueDate: newTaskDueDate,
  };
  const updatedTasks = [...tasks, newTask];
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
  setNewTaskTitle('');;
  setNewTaskCategory('');
  setNewTaskPriority('Moyenne');
  setNewTaskDueDate('');
  setNewTaskState('Nouveau');
  setNewTaskDescription(''); // Clear description field
  setShowTaskModal(false);
};

 const addCategory = () => {
  if (!newCategoryTitle || newCategoryTitle.length < 3) return;
  const newCategory = {
   id: Date.now(),
   title: newCategoryTitle,
   color: newCategoryColor, // Utiliser la couleur sélectionnée
   emoji: '📁', // Default emoji
   active: true,
   description: '',
  };
  const updatedCategories = [...categories, newCategory];
  setCategories(updatedCategories);
  saveToLocalStorage(tasks, updatedCategories);
  setNewCategoryTitle('');
  setNewCategoryColor('#ffa064'); // Réinitialiser la couleur
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
        // Si on finalise la tâche, on la marque comme "Réussi"
        return { 
          ...task, 
          done: true, 
          previousState: task.state, // Mémoriser l'état précédent
          state: 'Réussi' 
        };
      } else {
        // Si on définalise, on restaure l'état précédent s'il existe
        return { 
          ...task, 
          done: false,
          state: task.previousState || task.state // Revenir à l'état précédent ou garder l'état actuel
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
  setEditTaskTitle(task.title);
  setEditTaskPriority(task.priority);
  setEditTaskDueDate(task.dueDate || ''); // Modification ici: utiliser task.dueDate au lieu de task.date_echeance
  setEditTaskCategory(task.category);
  setEditTaskState(task.state); // Initialiser l'état de la tâche
  setEditTaskDescription(task.description || ''); // Initialize with task description
  setShowEditModal(true);
 };

 const saveEditedTask = () => {
  const updatedTasks = tasks.map(task => 
   task.id === editTaskId ? { 
     ...task, 
     title: editTaskTitle, 
     priority: editTaskPriority, 
     dueDate: editTaskDueDate, // Modification ici: utiliser dueDate au lieu de date_echeance
     category: editTaskCategory,
     state: editTaskState, // Inclure l'état dans les modifications
     description: editTaskDescription // Include the updated description
   } : task
  );
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
  setShowEditModal(false);
 };

 // Fonction changeTaskState maintenue pour d'éventuelles utilisations futures
 const changeTaskState = (id, newState) => {
  const updatedTasks = tasks.map(task =>
   task.id === id ? { ...task, state: newState } : task
  );
  setTasks(updatedTasks);
  saveToLocalStorage(updatedTasks, categories);
 };

 const remainingTasks = tasks.filter(task => !task.done).length;
 const completedTasks = tasks.filter(task => task.done).length;

 // Filter tasks based on filters and view mode
 const filteredTasks = tasks
  .filter(task => {
   // Filtrer par recherche de titre (insensible à la casse)
   if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
     return false;
   }
   
   // In task view, by default only show non-completed tasks
   if (viewMode === 'tasks' && 
       filters.category.length === 0 && 
       filters.state.length === 0 && 
       filters.urgent === null && 
       filters.done === null) {
     return !COMPLETED_STATES.includes(task.state);
   }
   
   // Apply regular filters
   if (filters.category.length && !filters.category.includes(task.category)) return false;
   if (filters.state.length && !filters.state.includes(task.state)) return false;
   if (filters.urgent !== null && task.urgent !== filters.urgent) return false;
   if (filters.done !== null && task.done !== filters.done) return false;
   return true;
  })
  .sort((a, b) => {
   // Priority sorting (Haute > Moyenne > Basse)
   const priorityValues = { 'Haute': 1, 'Moyenne': 2, 'Basse': 3 };
   const priorityA = priorityValues[a.priority] || 2; // Default to Medium if undefined
   const priorityB = priorityValues[b.priority] || 2; // Default to Medium if undefined
   
   if (priorityA !== priorityB) {
     return priorityA - priorityB; // Sort by priority first
   }
   
   // If priorities are equal, sort by the selected criteria
   if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
   if (sortBy === 'creationDate') return new Date(a.creationDate) - new Date(b.creationDate);
   if (sortBy === 'name') return a.title.localeCompare(b.title);
   return 0;
  });

 // Group tasks by category for category view
 const tasksByCategory = categories.reduce((acc, category) => {
  acc[category.title] = filteredTasks.filter(task => task.category === category.title);
  return acc;
 }, {});

 // Make sure "Sans catégorie" is included
 tasksByCategory['Sans catégorie'] = filteredTasks.filter(task => 
   task.category === 'Sans catégorie' || !task.category);

 // Définition des couleurs disponibles
 const colorOptions = [
  { name: 'red', hex: '#ff6464' },
  { name: 'orange', hex: '#ffa064' },
  { name: 'yellow', hex: '#ffdc64' },
  { name: 'green', hex: '#64ff8c' },
  { name: 'bluesky', hex: '#64d2ff' },
  { name: 'blue', hex: '#6485ff' },
  { name: 'purple', hex: '#a064ff' },
  { name: 'pink', hex: '#ff64dc' },
 ];

 // Export data to JSON file
 const exportToJson = () => {
   const data = {
     tasks: tasks,
     categories: categories
   };
   
   const jsonString = JSON.stringify(data, null, 2);
   const blob = new Blob([jsonString], { type: 'application/json' });
   const href = URL.createObjectURL(blob);
   
   // Create a download link
   const link = document.createElement('a');
   link.href = href;
   link.download = `todo-app-export-${new Date().toISOString().slice(0, 10)}.json`;
   document.body.appendChild(link);
   link.click();
   
   // Clean up
   document.body.removeChild(link);
   URL.revokeObjectURL(href);
 };
 
 // Import data from JSON file
 const importFromJson = (event) => {
   setImportError('');
   const file = event.target.files[0];
   if (!file) return;
   
   const reader = new FileReader();
   reader.onload = (e) => {
     try {
       const importedData = JSON.parse(e.target.result);
       
       // Validate data structure
       if (!importedData.tasks || !Array.isArray(importedData.tasks)) {
         throw new Error('Le format du fichier est invalide. Il doit contenir un tableau "tasks".');
       }
       
       if (!importedData.categories || !Array.isArray(importedData.categories)) {
         throw new Error('Le format du fichier est invalide. Il doit contenir un tableau "categories".');
       }
       
       // Apply imported data
       setTasks(importedData.tasks);
       setCategories(importedData.categories);
       
       // Save to localStorage
       saveToLocalStorage(importedData.tasks, importedData.categories);
       
       setShowImportModal(false);
     } catch (error) {
       console.error('Erreur lors de l\'importation:', error);
       setImportError('Erreur lors de l\'importation: ' + error.message);
     }
   };
   reader.readAsText(file);
 };

 return (
  <div>
   <header>
    <img src='logo_todo_list.png' alt='logo' />
    <div>
     Répartition des états :
     <ul>
      {TASK_STATES.map(state => (
       <li key={state}>
        {state}: {tasks.filter(task => task.state === state).length}
       </li>
      ))}
     </ul>
    </div>
   </header>

   <main>
    <h1>Liste des Tâches</h1>
    
    {/* Barre de recherche et bouton de filtres combinés */}
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
        <span>Filtres</span>
        {(filters.category.length > 0 || filters.state.length > 0 || filters.urgent !== null || filters.done !== null) && (
          <span className="filter-indicator">!</span>
        )}
      </button>
    </div>
    
    {/* Supprimer les anciens boutons de filtres individuels */}
    
    {viewMode === 'tasks' ? (
      <ul>
       {filteredTasks.map(task => (
        <li
         key={task.id}
         style={{
          textDecoration: task.done ? 'line-through' : 'none',
          color: task.urgent ? 'red' : 'inherit',
         }}
        >
         <div>{task.title} ({task.category}) - Priorité : {task.priority}</div>
         <div>Date d'échéance : {task.dueDate || 'Non définie'}</div>
         <div>État : {task.state}</div>
         <div>Description : {task.description}</div>
         <button onClick={() => finalizeTask(task.id)}>
          {task.done ? 'Annuler' : 'Finaliser'}
         </button>
         <button onClick={() => editTask(task)}>Modifier</button>
         <button onClick={() => deleteTask(task.id)}>Supprimer</button>
        </li>
       ))}
      </ul>
    ) : (
      // Category View
      <div className="categories-view">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category} className="category-group">
            <h3>{category} ({categoryTasks.length})</h3>
            {categoryTasks.length > 0 ? (
              <ul>
                {categoryTasks.map(task => (
                  <li
                    key={task.id}
                    style={{
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.urgent ? 'red' : 'inherit',
                    }}
                  >
                    <div>{task.title} - Priorité : {task.priority}</div>
                    <div>Date d'échéance : {task.dueDate || 'Non définie'}</div>
                    <div>État : {task.state}</div>
                    <div>Description : {task.description}</div>
                    <button onClick={() => finalizeTask(task.id)}>
                      {task.done ? 'Annuler' : 'Finaliser'}
                    </button>
                    <button onClick={() => editTask(task)}>Modifier</button>
                    <button onClick={() => deleteTask(task.id)}>Supprimer</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune tâche dans cette catégorie</p>
            )}
          </div>
        ))}
      </div>
    )}
    
    <div className="categories-list">
      <h2>Catégories</h2>
      {categories.map(category => (
        <div key={category.id} className="category-item" style={{ backgroundColor: category.color }}>
          <h3>{category.title}</h3>
          <p>{category.description}</p>
        </div>
      ))}
    </div>
   </main>

   <footer>
    <button onClick={() => setShowTaskModal(true)}>Ajouter Tâche</button>
    <button onClick={() => setShowCategoryModal(true)}>Ajouter Catégorie</button>
    <button onClick={() => setViewMode(viewMode === 'tasks' ? 'categories' : 'tasks')}>
      {viewMode === 'tasks' ? 'Voir par Catégories' : 'Voir par Tâches'}
    </button>
    <div className="data-actions">
      <button onClick={exportToJson}>Exporter les données</button>
      <button onClick={() => setShowImportModal(true)}>Importer des données</button>
    </div>
   </footer>

   {showTaskModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Ajouter une tâche</h2>
      <input
       type="text"
       value={newTaskTitle}
       onChange={(e) => setNewTaskTitle(e.target.value)}
       placeholder="Titre de la tâche"
      />
      <select
       value={newTaskCategory}
       onChange={(e) => setNewTaskCategory(e.target.value)}
      >
       <option value="">Sans catégorie</option>
       {categories.map((category) => (
        <option key={category.id} value={category.title}>
         {category.title}
        </option>
       ))}
      </select>
      <label>Priorité :</label>
      <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
       <option value="Basse">Basse</option>
       <option value="Moyenne">Moyenne</option>
       <option value="Haute">Haute</option>
      </select>
      <label>Date d'échéance :</label>
      <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} />
      <label>État :</label>
      <select
        value={newTaskState}
        onChange={(e) => setNewTaskState(e.target.value)}
      >
        {TASK_STATES.map(state => (
         <option key={state} value={state}>
          {state}
         </option>
        ))}
      </select>
      <label>Description :</label>
      <textarea 
        value={newTaskDescription} 
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder="Description de la tâche"
        rows="4"
      ></textarea>
      <button onClick={addTask}>Ajouter</button>
      <button onClick={() => {
        setShowTaskModal(false);
        setNewTaskTitle('');
        setNewTaskCategory('');
        setNewTaskPriority('Moyenne');
        setNewTaskDueDate('');
        setNewTaskState('Nouveau');
        setNewTaskDescription(''); // Reset description
      }}>Annuler</button>
     </div>
    </div>
   )}

   {showCategoryModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Ajouter une catégorie</h2>
      <input
       type="text"
       value={newCategoryTitle}
       onChange={(e) => setNewCategoryTitle(e.target.value)}
       placeholder="Titre de la catégorie"
      />
      
      {/* Palette de sélection de couleur */}
      <div className="form-group">
        <label>Couleur:</label>
        <div className="color-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {colorOptions.map((color) => (
            <div
              key={color.name}
              className={`color-option ${newCategoryColor === color.hex ? 'selected' : ''}`}
              style={{ 
                backgroundColor: color.hex, 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%',
                cursor: 'pointer',
                border: newCategoryColor === color.hex ? '2px solid black' : '1px solid #ccc'
              }}
              onClick={() => setNewCategoryColor(color.hex)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <button onClick={addCategory}>Ajouter</button>
      <button onClick={() => {
        setShowCategoryModal(false);
        setNewCategoryTitle('');
        setNewCategoryColor('#ffa064');
      }}>Annuler</button>
     </div>
    </div>
   )}

   {showEditModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Modifier la tâche</h2>
      <input type="text" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} placeholder="Titre de la tâche" />
      <select value={editTaskPriority} onChange={(e) => setEditTaskPriority(e.target.value)}>
       <option value="Basse">Basse</option>
       <option value="Moyenne">Moyenne</option>
       <option value="Haute">Haute</option>
      </select>
      <input type="date" value={editTaskDueDate} onChange={(e) => setEditTaskDueDate(e.target.value)} />
      <select value={editTaskCategory} onChange={(e) => setEditTaskCategory(e.target.value)}>
       {categories.map(category => (
        <option key={category.id} value={category.title}>{category.title}</option>
       ))}
      </select>
      {/* Ajouter le select pour le changement d'état */}
      <select
        value={editTaskState}
        onChange={(e) => setEditTaskState(e.target.value)}
      >
        {TASK_STATES.map(state => (
         <option key={state} value={state}>
          {state}
         </option>
        ))}
      </select>
      <label>Description :</label>
      <textarea 
        value={editTaskDescription} 
        onChange={(e) => setEditTaskDescription(e.target.value)}
        placeholder="Description de la tâche"
        rows="4"
      ></textarea>
      <button onClick={saveEditedTask}>Sauvegarder</button>
      <button onClick={() => setShowEditModal(false)}>Annuler</button>
     </div>
    </div>
   )}
   
   {showCategoryFilterModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Filtrer par catégorie</h2>
      <div className="filter-options">
        {categories.map(category => (
          <div key={category.id}>
            <input 
              type="checkbox" 
              id={`cat-${category.id}`} 
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
            <label htmlFor={`cat-${category.id}`}>{category.title}</label>
          </div>
        ))}
        <div>
          <input 
            type="checkbox" 
            id="cat-sans-categorie" 
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
          <label htmlFor="cat-sans-categorie">Sans catégorie</label>
        </div>
      </div>
      <button onClick={applyCategoryFilter}>Appliquer</button>
      <button onClick={() => setShowCategoryFilterModal(false)}>Annuler</button>
     </div>
    </div>
   )}
   
   {showStateFilterModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Filtrer par état</h2>
      <div className="filter-options">
        {TASK_STATES.map(state => (
          <div key={state}>
            <input 
              type="checkbox" 
              id={`state-${state}`}
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
            <label htmlFor={`state-${state}`}>{state}</label>
          </div>
        ))}
      </div>
      <button onClick={applyStateFilter}>Appliquer</button>
      <button onClick={() => setShowStateFilterModal(false)}>Annuler</button>
     </div>
    </div>
   )}
   
   {showUrgencyFilterModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Filtrer par urgence</h2>
      <div className="filter-options">
        <div>
          <input 
            type="radio" 
            id="urgency-all" 
            name="urgency"
            checked={tempUrgencyFilter === null}
            onChange={() => setTempUrgencyFilter(null)}
          />
          <label htmlFor="urgency-all">Tous</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="urgency-urgent" 
            name="urgency"
            checked={tempUrgencyFilter === true}
            onChange={() => setTempUrgencyFilter(true)}
          />
          <label htmlFor="urgency-urgent">Urgent</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="urgency-not-urgent" 
            name="urgency"
            checked={tempUrgencyFilter === false}
            onChange={() => setTempUrgencyFilter(false)}
          />
          <label htmlFor="urgency-not-urgent">Non urgent</label>
        </div>
      </div>
      <button onClick={applyUrgencyFilter}>Appliquer</button>
      <button onClick={() => setShowUrgencyFilterModal(false)}>Annuler</button>
     </div>
    </div>
   )}
   
   {showDoneFilterModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Filtrer par statut</h2>
      <div className="filter-options">
        <div>
          <input 
            type="radio" 
            id="done-all" 
            name="done"
            checked={tempDoneFilter === null}
            onChange={() => setTempDoneFilter(null)}
          />
          <label htmlFor="done-all">Tous</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="done-yes" 
            name="done"
            checked={tempDoneFilter === true}
            onChange={() => setTempDoneFilter(true)}
          />
          <label htmlFor="done-yes">finalisées</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="done-no" 
            name="done"
            checked={tempDoneFilter === false}
            onChange={() => setTempDoneFilter(false)}
          />
          <label htmlFor="done-no">Pas finalisées</label>
        </div>
      </div>
      <button onClick={applyDoneFilter}>Appliquer</button>
      <button onClick={() => setShowDoneFilterModal(false)}>Annuler</button>
     </div>
    </div>
   )}
   
   {showSortModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Trier par</h2>
      <div className="filter-options">
        <div>
          <input 
            type="radio" 
            id="sort-due-date" 
            name="sort"
            checked={tempSortBy === 'dueDate'}
            onChange={() => setTempSortBy('dueDate')}
          />
          <label htmlFor="sort-due-date">Date d'échéance</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="sort-creation-date" 
            name="sort"
            checked={tempSortBy === 'creationDate'}
            onChange={() => setTempSortBy('creationDate')}
          />
          <label htmlFor="sort-creation-date">Date de création</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="sort-name" 
            name="sort"
            checked={tempSortBy === 'name'}
            onChange={() => setTempSortBy('name')}
          />
          <label htmlFor="sort-name">Nom</label>
        </div>
      </div>
      <button onClick={applySortFilter}>Appliquer</button>
      <button onClick={() => setShowSortModal(false)}>Annuler</button>
     </div>
    </div>
   )}

   {showImportModal && (
    <div className="modal">
     <div className="modal-content">
      <h2>Importer des données</h2>
      {importError && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{importError}</div>}
      <p>Sélectionnez un fichier JSON pour importer vos tâches et catégories.</p>
      <p><strong>Attention:</strong> Cette action remplacera toutes vos données actuelles.</p>
      
      <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Format attendu:</h4>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
{`{
  "tasks": [
    {
      "id": 123,
      "title": "Exemple de tâche",
      "description": "Description de la tâche",
      "category": "Maison",
      "priority": "Moyenne",
      "state": "Nouveau",
      "done": false,
      "creationDate": "2023-05-15T10:30:00.000Z",
      "dueDate": "2023-05-20"
    }
  ],
  "categories": [
    {
      "id": 456,
      "title": "Maison",
      "color": "#ffa064",
      "emoji": "📁",
      "active": true
    }
  ]
}`}
        </pre>
      </div>
      
      <input 
        type="file" 
        accept=".json" 
        onChange={importFromJson}
        style={{ margin: '15px 0' }}
      />
      <div className="modal-actions">
        <button onClick={() => setShowImportModal(false)}>Annuler</button>
      </div>
     </div>
    </div>
   )}

   {/* Nouveau modal combiné pour les filtres et le tri */}
   {showFilterModal && (
    <div className="modal">
     <div className="modal-content filters-modal-content">
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
            {TASK_STATES.map(state => (
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
        <button className="btn-cancel" onClick={() => setShowFilterModal(false)}>
          Annuler
        </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}

export default App;
