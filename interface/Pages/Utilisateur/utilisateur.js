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

    // Déconnexion avec confirmation
    logoutBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Se déconnecter ?',
            text: "Voulez-vous vraiment vous déconnecter ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, déconnecter',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user');

                Swal.fire({
                    title: 'Déconnecté',
                    text: 'Vous avez été déconnecté avec succès.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    didClose: () => {
                        window.location.href = '../../login/seConnecter.html';
                    }
                });
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const userCards = document.querySelectorAll(".user-card");

    userCards.forEach(card => {
        card.addEventListener("click", async() => {
            const userId = card.dataset.id;
            const userName = card.dataset.name;

            const { value: formValues } = await Swal.fire({
                title: '🛠️ Mise à jour du profil',
                html: `
                    <div style="display: flex; flex-direction: column; gap: 15px; text-align: left; font-size: 16px;">
                        <label style="font-weight: 600; color: #555;">👤 Nom d'utilisateur</label>
                        <input id="swal-input-name" class="swal2-input" style="padding: 12px; border-radius: 8px;" placeholder="Entrez le nom" value="${userName || ''}">

                        <label style="font-weight: 600; color: #555;">🔐 Nouveau mot de passe</label>
                        <input id="swal-input-password" class="swal2-input" type="password" style="padding: 12px; border-radius: 8px;" placeholder="Mot de passe">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '💾 Mettre à jour',
                cancelButtonText: '❌ Annuler',
                focusConfirm: false,
                background: '#f0f4f8',
                width: 600,
                customClass: {
                    confirmButton: 'swal2-confirm swal-btn-custom',
                    cancelButton: 'swal2-cancel swal-btn-cancel'
                },
                preConfirm: () => {
                    const name = document.getElementById('swal-input-name').value.trim();
                    const password = document.getElementById('swal-input-password').value.trim();

                    if (!name || !password) {
                        Swal.showValidationMessage("⚠️ Veuillez remplir tous les champs.");
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

                    Swal.fire('✅ Succès', `Profil mis à jour avec succès !`, 'success');
                } catch (err) {
                    Swal.fire('⚠️ Erreur réseau', err.message, 'error');
                }
            }
        });
    });
});