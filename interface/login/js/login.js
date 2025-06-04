// const apiUrl = 'http://localhost:3000';

// window.addEventListener('DOMContentLoaded', () => {
//     // Attacher les événements
//     document.getElementById('login-btn').addEventListener('click', login);

// });


// function login() {
//     const name = document.getElementById('username').value;
//     const password = document.getElementById('password').value;


//     fetch(`${apiUrl}/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, password })
//         })
//         .then(async res => {
//             const data = await res.json();

//             if (!res.ok) {
//                 // ❌ Mauvais identifiants ou erreur serveur
//                 alert("Échec de la connexion : " + (data.error || 'Erreur inconnue'));
//                 return;
//             }

//             // ✅ Succès
//             alert("Connexion réussie ! Bienvenue " + data.user.name);
//         })
//         .catch(err => {
//             // ❌ Erreur réseau (ex: serveur éteint)
//             alert("Erreur réseau : " + err.message);
//         });
// }