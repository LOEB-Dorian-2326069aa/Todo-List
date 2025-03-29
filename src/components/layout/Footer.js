import React from 'react';

function Footer({ setShowTaskModal, setShowCategoryModal, exportToJson, setShowImportModal }) {
  return (
    <footer>
      <button onClick={() => setShowTaskModal(true)}>Ajouter Tâche</button>
      <button onClick={() => setShowCategoryModal(true)}>Ajouter Catégorie</button>
      <div className="data-actions">
        <button onClick={exportToJson}>Exporter les données</button>
        <button onClick={() => setShowImportModal(true)}>Importer des données</button>
      </div>
    </footer>
  );
}

export default Footer;
