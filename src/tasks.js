import data from './data.js';

export function getAllTasks() {
    // Retourne toutes les tâches
    return data.taches;
}

export function getNonFinishedTasks() {
    // Retourne les tâches non terminées triées par date d'échéance croissante
    return data.taches
        .filter(task => task.etat !== 'ETAT_TERMINE')
        .sort((a, b) => new Date(a.dateEcheance) - new Date(b.dateEcheance));
}

export function getFilteredTasks({ urgent = null, done = null, categorie = null, tri = null } = {}) {
    let tasks = data.taches.filter(task => {
        // Filtre par urgence si spécifié
        if (urgent !== null && task.urgent !== urgent) return false;
        // Filtre par statut (fait/non fait) si spécifié
        if (done !== null && task.done !== done) return false;
        // Filtre par catégorie si spécifié
        if (categorie !== null) {
            const relation = data.relations.find(rel => rel.tache === task.id);
            if (!relation || relation.categorie !== categorie) return false;
        }
        return true;
    });

    // Tri des tâches si spécifié
    if (tri === 'dateCreation') {
        tasks.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation));
    } else if (tri === 'dateEcheance') {
        tasks.sort((a, b) => new Date(a.dateEcheance) - new Date(b.dateEcheance));
    } else if (tri === 'nom') {
        tasks.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    return tasks;
}

export function getTaskStatistics() {
    const totalTasks = data.taches.length;
    const nonFinishedTasks = data.taches.filter(task => task.etat !== 'ETAT_TERMINE').length;
    const stateDistribution = data.taches.reduce((acc, task) => {
        acc[task.etat] = (acc[task.etat] || 0) + 1;
        return acc;
    }, {});
    return { totalTasks, nonFinishedTasks, stateDistribution };
}

// Exemple d'utilisation
console.log('Tâches non terminées :', getNonFinishedTasks());
console.log('Tâches urgentes triées par date de création :', getFilteredTasks({ urgent: true, tri: 'dateCreation' }));
console.log('Statistiques des tâches :', getTaskStatistics());