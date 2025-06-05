document.addEventListener('DOMContentLoaded', () => {
    const userInfoDiv = document.querySelector('.user-info h5');

    // Récupère les données utilisateur du localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
        const user = JSON.parse(userData);
        userInfoDiv.textContent = `Bienvenue, ${user.name}`;
    } else {
        userInfoDiv.textContent = 'Utilisateur non connecté';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    // Récupérer l'utilisateur depuis localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
        const user = JSON.parse(userData);
        usernameDisplay.textContent = `Bienvenue, ${user.name}`;
    } else {
        usernameDisplay.textContent = 'Utilisateur non connecté';
    }

    // Déconnexion
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user'); // Supprime les données de l'utilisateur
        window.location.href = '../../login/seConnecter.html'; // Redirige vers la page de connexion
    });
});