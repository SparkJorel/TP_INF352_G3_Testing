document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('vehicle-container');

    fetch('http://localhost:3000/api/vehicles')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error("Données invalides reçues");
            }

            data.forEach(vehicle => {
                const card = document.createElement('div');
                card.className = 'vehicle-card hover-shine';

                card.innerHTML = `
                    <div class="floating">
                        <img src="./67353.jpg" alt="${vehicle.model}" class="vehicle-img">
                    </div>
                    <div class="vehicle-info">
                        <h5>${vehicle.make}</h5>
                        <p class="mb-1"><strong>Immatriculation:</strong> ${vehicle.registrationNumber}</p>
                        <p class="mb-1"><strong>Année:</strong> ${vehicle.annee}</p>
                        <p class="mb-1"><strong>Prix de location:</strong> ${vehicle.rentalPrice}€/jour</p>
                        <button class="reserve-btn" data-id="${vehicle.registrationNumber}" data-nom="${vehicle.make}">Réserver</button>
                        <button class="paiement-btn" data-id="${vehicle.registrationNumber}" data-nom="${vehicle.make}">Payer</button>
                    </div>
                `;

                container.appendChild(card);
            });

            // Gestion du clic sur les boutons "Réserver"
            const reserveButtons = document.querySelectorAll('.reserve-btn');
            const paiementButtons = document.querySelectorAll('.paiement-btn');

            reserveButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const vehicleId = e.target.dataset.id;
                    const nomVehicule = e.target.dataset.nom;

                    // Affichage d'une alerte ou redirection (à personnaliser)
                    Swal.fire({
                        title: `Réserver ${nomVehicule} ?`,
                        text: "Souhaitez-vous procéder à la réservation ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Oui, réserver',
                        cancelButtonText: 'Annuler'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Ici tu peux :
                            // - faire une requête POST vers `/api/reservations`
                            // - ou rediriger vers une page de paiement
                            alert(`🚗 Réservation en cours pour le véhicule ID ${vehicleId}`);
                        }
                    });
                });
            });

            paiementButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const vehicleId = e.target.dataset.id;
                    const nomVehicule = e.target.dataset.nom;

                    // Affichage d'une alerte ou redirection (à personnaliser)
                    Swal.fire({
                        title: `Payer ${nomVehicule} ?`,
                        text: "Souhaitez-vous procéder au paiement ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Oui, payer',
                        cancelButtonText: 'Annuler'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Ici tu peux :
                            // - faire une requête POST vers `/api/reservations`
                            // - ou rediriger vers une page de paiement
                            alert(`🚗 paiement en cours pour le véhicule ID ${vehicleId}`);
                        }
                    });
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des véhicules :', error);
            container.innerHTML = `<p style="color:red">Erreur de chargement des véhicules</p>`;
        });
});