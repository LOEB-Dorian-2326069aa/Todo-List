import React from 'react';

function TaskItem({ task, deleteTask, finalizeTask, editTask }) {
  return (
    <li
      style={{
        textDecoration: task.done ? 'line-through' : 'none',
        color: task.urgent ? 'red' : 'inherit',
      }}
    >
      <div>{task.title} ({task.category})</div>
      <div>Date d'échéance : {task.dueDate || 'Non définie'}</div>
      <div>État : {task.state}</div>
      <div>Description : {task.description}</div>
      <button onClick={() => finalizeTask(task.id)}>
        {task.done ? 'Annuler' : 'Finaliser'}
      </button>
      <button onClick={() => editTask(task)}>Modifier</button>
      <button onClick={() => deleteTask(task.id)}>Supprimer</button>
    </li>
  );
}

export default TaskItem;
