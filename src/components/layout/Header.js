import React from 'react';

function Header({ tasks, taskStates }) {
  return (
    <header>
      <img src='logo_todo_list.png' alt='logo' />
      <div>
        Répartition des états :
        <ul>
          {taskStates.map(state => (
            <li key={state}>
              {state}: {tasks.filter(task => task.state === state).length}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default Header;
