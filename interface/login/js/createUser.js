// const apiUrl = 'http://localhost:3000';

// window.addEventListener('DOMContentLoaded', () => {
//     // Attacher les événements
//     document.getElementById('login-btn').addEventListener('click', createUser);

// });

// function createUser() {
//     const name = document.getElementById('username').value;
//     const password = document.getElementById('password').value;


//     fetch(`${apiUrl}/users`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, password })
//         })
//         .then(async res => {
//             const data = await res.json();

//             if (!res.ok) {
//                 // ❌ Cas d’erreur (ex: 400 ou 500)
//                 throw new Error(data.error || 'Une erreur est survenue.');
//             }

//             // ✅ Succès
//             console.log('Utilisateur créé avec succès !\n' + JSON.stringify(data));
//         })
//         .catch(err => {
//             alert('Erreur : ' + err.message);
//         });

// }