import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, tasksByCategory, viewMode, deleteTask, finalizeTask, editTask }) {
  if (viewMode === 'tasks') {
    return (
      <ul>
        {tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            finalizeTask={finalizeTask}
            editTask={editTask}
          />
        ))}
      </ul>
    );
  } else {
    // Category view
    return (
      <div className="categories-view">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category} className="category-group">
            <h3>{category} ({categoryTasks.length})</h3>
            {categoryTasks.length > 0 ? (
              <ul>
                {categoryTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    finalizeTask={finalizeTask}
                    editTask={editTask}
                  />
                ))}
              </ul>
            ) : (
              <p>Aucune tâche dans cette catégorie</p>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default TaskList;
