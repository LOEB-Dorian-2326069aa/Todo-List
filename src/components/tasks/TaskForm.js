import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';

function TaskForm({ isEditing = false, task, editTaskId, categories, addTask, saveTask, setShowModal, taskStates }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [state, setState] = useState('Nouveau');
  const [description, setDescription] = useState('');

  // Initialize form with task data if editing
  useEffect(() => {
    if (isEditing && task) {
      setTitle(task.title || '');
      setCategory(task.category || '');
      setUrgent(task.urgent || false);
      setDueDate(task.dueDate || '');
      setState(task.state || 'Nouveau');
      setDescription(task.description || '');
    }
  }, [isEditing, task]);

  const handleSubmit = () => {
    if (!title || title.length < 3) return;

    if (isEditing) {
      saveTask({
        ...task,
        title,
        category,
        urgent,
        dueDate,
        state,
        description
      });
    } else {
      const newTask = {
        id: Date.now(),
        title,
        description,
        done: false,
        urgent,
        category: category || 'Sans catégorie',
        state,
        creationDate: new Date().toISOString(),
        dueDate,
      };
      addTask(newTask);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Modal>
      <h2>{isEditing ? 'Modifier la tâche' : 'Ajouter une tâche'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la tâche"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Sans catégorie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.title}>
            {category.title}
          </option>
        ))}
      </select>
      <div>
        <label>
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          Urgent
        </label>
      </div>
      <label>Date d'échéance :</label>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <label>État :</label>
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        {taskStates.map(state => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <label>Description :</label>
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description de la tâche"
        rows="4"
      ></textarea>
      <button onClick={handleSubmit}>{isEditing ? 'Sauvegarder' : 'Ajouter'}</button>
      <button onClick={handleCancel}>Annuler</button>
    </Modal>
  );
}

export default TaskForm;
