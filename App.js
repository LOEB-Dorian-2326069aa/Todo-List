import { useEffect, useState } from 'react';
import './style.css';

function App() {
  const [tasks, setTasks] = useState([]);  // Liste des tâches
  const [categories, setCategories] = useState([]);  // Liste des catégories
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Charger les données au démarrage
  useEffect(() => {
    fetch('/data.json')  // Charge le fichier JSON
      .then(response => response.json())  // Convertit en objet JS
      .then(data => {
        // Associer les tâches avec leurs catégories en fonction des relations
        const updatedTasks = data.taches.map(task => {
          const relation = data.relations.find(rel => rel.tache === task.id);
          return {
            ...task,
            category: relation ? data.categories.find(cat => cat.id === relation.categorie).title : "Sans catégorie"
          };
        });

        setTasks(updatedTasks);
        setCategories(data.categories);
      })
      .catch(error => console.error("Erreur de chargement des données :", error));
  }, []);

  // Fonction pour finaliser une tâche
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  // Fonction pour supprimer une tâche
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <h1>Ma To-Do List</h1>

      <h2>Tâches</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
            <span>{task.title} ({task.category})</span>
            <button onClick={() => toggleTaskStatus(task.id)}>
              {task.done ? "Annuler" : "Finaliser"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Catégories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} style={{ color: category.color }}>
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
