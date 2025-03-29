import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, deleteTask, finalizeTask, editTask }) {
  const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'));

  return (
    <ul>
      {sortedTasks.map(task => (
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
}

export default TaskList;
