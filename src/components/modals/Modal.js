import React from 'react';

function Modal({ children, className = '' }) {
  return (
    <div className={`modal ${className}`}>
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

export default Modal;
