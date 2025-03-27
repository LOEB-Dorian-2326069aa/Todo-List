import React, { useState } from 'react';
import Modal from '../modals/Modal';

function CategoryForm({ addCategory, setShowModal }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#ffa064');

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

  const handleSubmit = () => {
    if (!title || title.length < 3) return;
    const newCategory = {
      id: Date.now(),
      title,
      color,
      emoji: '📁',
      active: true,
      description: '',
    };
    addCategory(newCategory);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Modal>
      <h2>Ajouter une catégorie</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la catégorie"
      />
      
      <div className="form-group">
        <label>Couleur:</label>
        <div className="color-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {colorOptions.map((colorOption) => (
            <div
              key={colorOption.name}
              className={`color-option ${color === colorOption.hex ? 'selected' : ''}`}
              style={{ 
                backgroundColor: colorOption.hex, 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%',
                cursor: 'pointer',
                border: color === colorOption.hex ? '2px solid black' : '1px solid #ccc'
              }}
              onClick={() => setColor(colorOption.hex)}
              title={colorOption.name}
            />
          ))}
        </div>
      </div>

      <button onClick={handleSubmit}>Ajouter</button>
      <button onClick={handleCancel}>Annuler</button>
    </Modal>
  );
}

export default CategoryForm;
