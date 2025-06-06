document.addEventListener('DOMContentLoaded', () => {
    const userInfoDiv = document.querySelector('.user-info h5');

    // Récupère les données utilisateur du localStorage
    const userData = localStorage.getItem('user');

    const userCard = document.querySelector('.user-card');

    // userCard.dataset.id = userData.id;
    // userCard.dataset.name = userData.name;

    if (userData) {
        const user = JSON.parse(userData);
        userCard.setAttribute('data-id', user.id)
        userCard.setAttribute('data-name', user.name)
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

document.addEventListener("DOMContentLoaded", () => {
    const userCards = document.querySelectorAll(".user-card");

    userCards.forEach(card => {
        card.addEventListener("click", async() => {
            const userId = card.dataset.id;
            const userName = card.dataset.name;
            alert(userId)
            alert(userName)
            const { value: formValues } = await Swal.fire({
                title: '✨ Modifier le profil',
                html: `
                    <div style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                        <label style="font-weight: 600;">👤 Nom d'utilisateur</label>
                        <input id="swal-input-name" class="swal2-input" placeholder="Entrez le nom" value="${userName || ''}" style="padding-left: 10px;">

                        <label style="font-weight: 600;">🔒 Nouveau mot de passe</label>
                        <input id="swal-input-password" class="swal2-input" type="password" placeholder="Mot de passe" style="padding-left: 10px;">
                    </div>
                `,
                background: '#f9f9f9',
                confirmButtonText: '<i class="fa fa-check"></i> Mettre à jour',
                cancelButtonText: '<i class="fa fa-times"></i> Annuler',
                showCancelButton: true,
                focusConfirm: false,
                width: 5000,
                customClass: {
                    confirmButton: 'swal2-confirm btn-green',
                    cancelButton: 'swal2-cancel btn-red'
                },
                preConfirm: () => {
                    const name = document.getElementById('swal-input-name').value.trim();
                    const password = document.getElementById('swal-input-password').value.trim();

                    if (!name || !password) {
                        Swal.showValidationMessage("⚠️ Tous les champs sont requis.");
                        return false;
                    }

                    return { name, password };
                }
            });

            if (formValues) {
                try {
                    const response = await fetch(`http://localhost:3000/users/${userId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formValues)
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        Swal.fire('❌ Erreur', data.error || "Impossible de mettre à jour l'utilisateur.", 'error');
                        return;
                    }

                    Swal.fire('✅ Succès', `Utilisateur mis à jour avec succès !`, 'success');
                } catch (err) {
                    Swal.fire('Erreur réseau', err.message, 'error');
                }
            }
        });
    });
});