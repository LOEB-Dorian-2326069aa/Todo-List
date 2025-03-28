import React from 'react';
import Modal from './Modal';

function ImportExportModal({ importFromJson, importError, setShowModal }) {
  return (
    <Modal>
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
        <p style={{ marginTop: '10px' }}>Le format avec "taches" au lieu de "tasks" est également accepté.</p>
      </div>
      
      <input 
        type="file" 
        accept=".json" 
        onChange={importFromJson}
        style={{ margin: '15px 0' }}
      />
      <div className="modal-actions">
        <button onClick={() => setShowModal(false)}>Annuler</button>
      </div>
    </Modal>
  );
}

export default ImportExportModal;
