// Mock data for vehicles, simulating an API response
let mockVehiclesData = [
    { 
        immatriculation: "AB-123-CD", 
        marque: "Renault", 
        modele: "Clio V", 
        annee: 2022, 
        prix_location: 45, 
        image_url: "/renault_clio.png" 
    },
    { 
        immatriculation: "EF-456-GH", 
        marque: "Peugeot", 
        modele: "208 II", 
        annee: 2021, 
        prix_location: 40, 
        image_url: "/peugeot_208.png" 
    },
    { 
        immatriculation: "IJ-789-KL", 
        marque: "BMW", 
        modele: "Série 3 (G20)", 
        annee: 2023, 
        prix_location: 90, 
        image_url: "/bmw_serie3.png" 
    },
    { 
        immatriculation: "MN-012-OP", 
        marque: "Mercedes-Benz", 
        modele: "Classe A (W177)", 
        annee: 2022, 
        prix_location: 85, 
        image_url: "/mercedes_classe_a.png" 
    },
    {
        immatriculation: "QR-345-ST",
        marque: "Toyota",
        modele: "Yaris IV",
        annee: 2022,
        prix_location: 50,
        image_url: "/toyota_yaris.png"
    }
];

const API_ENDPOINT = '/api/vehicles';

// Store the original fetch function
const originalFetch = window.fetch;

window.fetch = function(url, options) {
    const method = options ? (options.method || 'GET') : 'GET';
    const body = options && options.body ? JSON.parse(options.body) : null;
    console.log(`Mock API called: ${method} ${url}`, body);

    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            // GET /api/vehicles (get all)
            if (url === API_ENDPOINT && method === 'GET') {
                resolve({ ok: true, status: 200, json: () => Promise.resolve([...mockVehiclesData]) });
            }
            // POST /api/vehicles (create)
            else if (url === API_ENDPOINT && method === 'POST') {
                if (!body || !body.immatriculation) {
                    resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: "Données manquantes ou incorrectes."}) });
                    return; 
                }
                if (mockVehiclesData.find(v => v.immatriculation === body.immatriculation)) {
                    resolve({ ok: false, status: 409, json: () => Promise.resolve({ message: "Un véhicule avec cette immatriculation existe déjà." }) });
                } else {
                    const newVehicle = { ...body };
                    // For blob URLs, they are temporary. If this were a real backend,
                    // the file would be uploaded and a permanent URL stored.
                    // Here, we just store the blob URL.
                    mockVehiclesData.push(newVehicle);
                    resolve({ ok: true, status: 201, json: () => Promise.resolve(newVehicle) });
                }
            }
            // Specific vehicle by registration (path parameter)
            // e.g., /api/vehicles/registration/AB-123-CD
            else if (url.startsWith(API_ENDPOINT + '/registration/') && method === 'GET') {
                const immatriculation = url.substring((API_ENDPOINT + '/registration/').length);
                const vehicle = mockVehiclesData.find(v => v.immatriculation === immatriculation);
                if (vehicle) {
                    resolve({ ok: true, status: 200, json: () => Promise.resolve(vehicle) });
                } else {
                    resolve({ ok: false, status: 404, json: () => Promise.resolve({ message: "Véhicule non trouvé." }) });
                }
            }
            // PUT /api/vehicles/{immatriculation} (update)
            // e.g., /api/vehicles/AB-123-CD
            else if (url.startsWith(API_ENDPOINT + '/') && method === 'PUT' && !url.includes('/search') && !url.includes('/registration/')) {
                const immatriculation = url.substring((API_ENDPOINT + '/').length);
                const vehicleIndex = mockVehiclesData.findIndex(v => v.immatriculation === immatriculation);
                if (vehicleIndex !== -1) {
                    // Note: if body.immatriculation changes, it's complex.
                    // For this mock, we assume immatriculation in path is the key,
                    // and body.immatriculation (if present and different) updates the property.
                    mockVehiclesData[vehicleIndex] = { ...mockVehiclesData[vehicleIndex], ...body };
                    // If immatriculation key itself is changed in body, update it.
                    if (body.immatriculation && body.immatriculation !== immatriculation) {
                         mockVehiclesData[vehicleIndex].immatriculation = body.immatriculation;
                    }
                    resolve({ ok: true, status: 200, json: () => Promise.resolve(mockVehiclesData[vehicleIndex]) });
                } else {
                    resolve({ ok: false, status: 404, json: () => Promise.resolve({ message: "Véhicule non trouvé pour mise à jour." }) });
                }
            }
            // DELETE /api/vehicles/{immatriculation} (delete)
            // e.g., /api/vehicles/AB-123-CD
            else if (url.startsWith(API_ENDPOINT + '/') && method === 'DELETE' && !url.includes('/search') && !url.includes('/registration/')) {
                const immatriculation = url.substring((API_ENDPOINT + '/').length);
                const vehicleToDelete = mockVehiclesData.find(v => v.immatriculation === immatriculation);
                if (vehicleToDelete && vehicleToDelete.image_url && vehicleToDelete.image_url.startsWith('blob:')) {
                    URL.revokeObjectURL(vehicleToDelete.image_url); // Clean up blob URL
                }
                const initialLength = mockVehiclesData.length;
                mockVehiclesData = mockVehiclesData.filter(v => v.immatriculation !== immatriculation);
                if (mockVehiclesData.length < initialLength) {
                    resolve({ ok: true, status: 204, json: () => Promise.resolve() }); // No content
                } else {
                    resolve({ ok: false, status: 404, json: () => Promise.resolve({ message: "Véhicule non trouvé pour suppression." }) });
                }
            }
            // GET /api/vehicles/search?registration_contains=... OR ?price_le=...
            else if (url.startsWith(API_ENDPOINT + '/search') && method === 'GET') {
                const searchParams = new URLSearchParams(url.split('?')[1]);
                let results = [...mockVehiclesData];
                
                if (searchParams.has('registration_contains')) {
                    const query = searchParams.get('registration_contains').toLowerCase();
                    results = results.filter(v => v.immatriculation.toLowerCase().includes(query));
                }
                if (searchParams.has('price_le')) {
                    const price = parseFloat(searchParams.get('price_le'));
                    results = results.filter(v => v.prix_location <= price);
                }
                resolve({ ok: true, status: 200, json: () => Promise.resolve(results) });
            }
            // Fallback to original fetch or reject
            else {
                if (originalFetch) {
                    return originalFetch.apply(this, arguments).then(resolve).catch(reject);
                }
                reject(new Error('Mock API endpoint not recognized: ' + method + ' ' + url));
            }
        }, 250); // simulate delay, reduced for snappier UI
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('vehiclesTableBody');
    const messageArea = document.getElementById('messageArea');

    const vehicleForm = document.getElementById('vehicleForm');
    const immatriculationInput = document.getElementById('immatriculation');
    const marqueInput = document.getElementById('marque');
    const modeleInput = document.getElementById('modele');
    const anneeInput = document.getElementById('annee');
    const prixLocationInput = document.getElementById('prix_location');
    const imageFileInput = document.getElementById('image_file');
    const imagePreview = document.getElementById('imagePreview');

    const addVehicleButton = document.getElementById('addVehicleButton');
    const updateVehicleButton = document.getElementById('updateVehicleButton');
    const clearFormButton = document.getElementById('clearFormButton');

    const searchInput = document.getElementById('searchInput');
    const searchTypeSelect = document.getElementById('searchType');
    const searchVehicleButton = document.getElementById('searchVehicleButton');

    // Sidebar navigation elements
    const navAddVehicle = document.getElementById('navAddVehicle');
    const navSearchVehicle = document.getElementById('navSearchVehicle');
    const navListAllVehicles = document.getElementById('navListAllVehicles');
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');


    // Content sections
    const vehicleFormContainer = document.getElementById('vehicleFormContainer');
    const searchContainer = document.getElementById('searchContainer');
    const listAllContainer = document.getElementById('listAllContainer'); // Contains the table

    const contentSections = [vehicleFormContainer, searchContainer, listAllContainer];

    let currentEditingImmatriculation = null;
    let currentBlobUrl = null; // To manage temporary blob URLs

    function displayMessage(text, type = 'info') { // type can be 'info', 'success', 'error'
        messageArea.textContent = text;
        messageArea.className = `message-area message-${type}`;
    }
    
    function setActiveView(viewToShow) {
        contentSections.forEach(section => {
            section.style.display = section === viewToShow ? 'block' : 'none';
        });
        sidebarNavItems.forEach(item => item.classList.remove('active'));
        if (viewToShow === vehicleFormContainer) navAddVehicle.classList.add('active');
        else if (viewToShow === searchContainer) navSearchVehicle.classList.add('active');
        else if (viewToShow === listAllContainer) navListAllVehicles.classList.add('active');
        
        // If showing table (listAll or after search), ensure table is visible within searchContainer if that's active
        if (viewToShow === searchContainer) {
            listAllContainer.style.display = 'block'; // Search results use the main table
        } else if (viewToShow !== listAllContainer && viewToShow !== vehicleFormContainer) {
             // If not search view and not form view, listAllContainer should be primary for table
        }

        if (viewToShow === vehicleFormContainer) {
            vehicleFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }


    imageFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl); // Revoke previous blob URL
            currentBlobUrl = null;
        }
        if (file) {
            currentBlobUrl = URL.createObjectURL(file);
            imagePreview.src = currentBlobUrl;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.src = '/placeholder.png';
            // imagePreview.style.display = 'none'; // Or keep placeholder visible
        }
    });

    function renderTable(vehicles) {
        tableBody.innerHTML = ''; // Clear previous data
        if (vehicles.length === 0) {
            // displayMessage('Aucun véhicule trouvé.', 'info'); // Message handled by caller
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 7; // Span all columns
            cell.textContent = 'Aucun véhicule à afficher.';
            cell.style.textAlign = 'center';
            return;
        }
        vehicles.forEach(vehicle => {
            const row = tableBody.insertRow();
            
            row.insertCell().textContent = vehicle.immatriculation;
            row.insertCell().textContent = vehicle.marque;
            row.insertCell().textContent = vehicle.modele;
            row.insertCell().textContent = vehicle.annee;
            row.insertCell().textContent = vehicle.prix_location;
            
            const imageCell = row.insertCell();
            const img = document.createElement('img');
            img.src = vehicle.image_url || '/placeholder.png'; // Use placeholder if no URL
            img.alt = `${vehicle.marque} ${vehicle.modele}`;
            img.onerror = () => { 
                img.alt = 'Image non disponible'; 
                img.src = '/placeholder.png'; // Fallback placeholder
                // imageCell.textContent = 'Image N/A'; // Avoid text if image fails
            };
            imageCell.appendChild(img);

            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.textContent = 'Modifier';
            editButton.classList.add('action-button', 'edit-button');
            editButton.onclick = () => prepareEditForm(vehicle.immatriculation);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.classList.add('action-button', 'delete-button');
            deleteButton.onclick = () => deleteVehicle(vehicle.immatriculation);
            actionsCell.appendChild(deleteButton);
        });
    }

    async function loadAllVehicles(showSuccessMessage = false) {
        setActiveView(listAllContainer);
        displayMessage('Chargement de tous les véhicules...', 'info');
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            const vehicles = await response.json();
            renderTable(vehicles);
            if (showSuccessMessage) {
                 displayMessage(vehicles.length > 0 ? `${vehicles.length} véhicules chargés.` : 'Aucun véhicule trouvé.', vehicles.length > 0 ? 'success' : 'info');
            } else if (vehicles.length > 0) {
                 displayMessage('', 'info'); // Clear loading message if vehicles found
            } else {
                displayMessage('Aucun véhicule disponible.', 'info');
            }
        } catch (error) {
            console.error('Erreur chargement véhicules:', error);
            displayMessage(`Erreur: ${error.message}`, 'error');
            renderTable([]); // Render empty table on error
        }
    }
    
    vehicleForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        if (currentEditingImmatriculation) {
            handleUpdateVehicle();
        } else {
            handleAddVehicle();
        }
    });
    
    // addVehicleButton click is handled by form submit
    updateVehicleButton.addEventListener('click', handleUpdateVehicle);


    async function handleAddVehicle() {
        let imageUrlForData = '/placeholder.png';
        if (imageFileInput.files[0] && currentBlobUrl) {
            imageUrlForData = currentBlobUrl; // Use the live blob URL
        }

        const vehicleData = {
            immatriculation: immatriculationInput.value.trim(),
            marque: marqueInput.value.trim(),
            modele: modeleInput.value.trim(),
            annee: parseInt(anneeInput.value),
            prix_location: parseFloat(prixLocationInput.value),
            image_url: imageUrlForData
        };

        if (!vehicleData.immatriculation || !vehicleData.marque || !vehicleData.modele || isNaN(vehicleData.annee) || isNaN(vehicleData.prix_location)) {
            displayMessage("Veuillez remplir tous les champs obligatoires correctement.", "error");
            return;
        }
        
        displayMessage('Ajout du véhicule...', 'info');
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicleData)
            });
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || `Erreur HTTP: ${response.status}`);
            }
            displayMessage(`Véhicule ${result.immatriculation} ajouté avec succès.`, 'success');
            clearFormAndState();
            // Don't automatically switch view, user might want to add another.
            // Optionally, load all vehicles if current view is table:
            if (listAllContainer.style.display === 'block' && searchContainer.style.display === 'none') {
                loadAllVehicles();
            }
        } catch (error) {
            console.error('Erreur ajout véhicule:', error);
            displayMessage(`Erreur: ${error.message}`, 'error');
             // if blob url was used but failed, it's already in mockVehiclesData in mock API part, 
             // no special cleanup needed here for currentBlobUrl as it's per-form-session
        }
    }

    async function prepareEditForm(immatriculation) {
        setActiveView(vehicleFormContainer);
        displayMessage('Chargement des données du véhicule pour modification...', 'info');
        try {
            const response = await fetch(`${API_ENDPOINT}/registration/${immatriculation}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
            }
            const vehicle = await response.json();

            immatriculationInput.value = vehicle.immatriculation;
            immatriculationInput.readOnly = true; 
            marqueInput.value = vehicle.marque;
            modeleInput.value = vehicle.modele;
            anneeInput.value = vehicle.annee;
            prixLocationInput.value = vehicle.prix_location;
            
            imageFileInput.value = null; // Clear file input
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl); // Revoke previous blob URL if any
                currentBlobUrl = null;
            }
            imagePreview.src = vehicle.image_url || '/placeholder.png';
            imagePreview.style.display = 'block';
            // If vehicle.image_url is a blob, it's already a "live" URL.
            // If it's a path, that's fine too. No need to create a new blob URL here unless a new file is selected.

            currentEditingImmatriculation = vehicle.immatriculation;
            addVehicleButton.style.display = 'none';
            updateVehicleButton.style.display = 'inline-block';
            displayMessage(`Modification du véhicule: ${vehicle.immatriculation}`, 'info');
            // vehicleFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Already done by setActiveView

        } catch (error) {
            console.error('Erreur préparation modification:', error);
            displayMessage(`Erreur: ${error.message}`, 'error');
            setActiveView(listAllContainer); // Go back to list if error
        }
    }

    async function handleUpdateVehicle() {
        if (!currentEditingImmatriculation) return;

        let imageUrlForUpdate;
        const existingVehicle = mockVehiclesData.find(v => v.immatriculation === currentEditingImmatriculation);

        if (imageFileInput.files[0] && currentBlobUrl) { // New file selected
            imageUrlForUpdate = currentBlobUrl;
            // If old image was a blob, revoke it (will be done by mock DELETE/PUT if it changes)
            if (existingVehicle && existingVehicle.image_url && existingVehicle.image_url.startsWith('blob:') && existingVehicle.image_url !== currentBlobUrl) {
                 // The mock API doesn't do this, but a real one would handle old file deletion.
                 // For the frontend, currentBlobUrl is the new one. The old one from mockVehiclesData will be replaced.
            }
        } else if (existingVehicle) { // No new file, keep existing URL
            imageUrlForUpdate = existingVehicle.image_url;
        } else { // Fallback, though should not happen if existingVehicle is found
            imageUrlForUpdate = '/placeholder.png';
        }


        const vehicleData = {
            marque: marqueInput.value.trim(),
            modele: modeleInput.value.trim(),
            annee: parseInt(anneeInput.value),
            prix_location: parseFloat(prixLocationInput.value),
            image_url: imageUrlForUpdate,
            immatriculation: immatriculationInput.value.trim() // Send immat in case it's editable by API
        };

        if (!vehicleData.marque || !vehicleData.modele || isNaN(vehicleData.annee) || isNaN(vehicleData.prix_location)) {
            displayMessage("Veuillez remplir tous les champs obligatoires correctement.", "error");
            return;
        }

        displayMessage('Mise à jour du véhicule...', 'info');
        try {
            const response = await fetch(`${API_ENDPOINT}/${currentEditingImmatriculation}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicleData)
            });
            const result = await response.json(); 
            if (!response.ok) {
                throw new Error(result.message || `Erreur HTTP: ${response.status}`);
            }
            displayMessage(`Véhicule ${result.immatriculation} mis à jour avec succès.`, 'success');
            clearFormAndState();
            // Stay on form view or switch to list? Let's stay on form, but clear it.
            // To switch to list: loadAllVehicles(true);
            // For now, just update data; if user wants to see list, they can click nav.
            // If the currently viewed list was based on a search, it might be out of sync.
            // Better to refresh the main list view when an update happens.
            if (listAllContainer.style.display === 'block' && searchContainer.style.display === 'none') { // if main list is active
                 loadAllVehicles();
            }


        } catch (error) {
            console.error('Erreur mise à jour véhicule:', error);
            displayMessage(`Erreur: ${error.message}`, 'error');
        }
    }

    async function deleteVehicle(immatriculation) {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${immatriculation} ?`)) {
            return;
        }
        displayMessage('Suppression du véhicule...', 'info');
        try {
            // Revoke blob URL before deleting from mock data if applicable
            const vehicleToDelete = mockVehiclesData.find(v => v.immatriculation === immatriculation);
            // This is already handled in the mock fetch DELETE part, but good to be mindful

            const response = await fetch(`${API_ENDPOINT}/${immatriculation}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                 const errorData = await response.json().catch(() => null); 
                 throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
            }
            displayMessage(`Véhicule ${immatriculation} supprimé avec succès.`, 'success');
            
            if (currentEditingImmatriculation === immatriculation) { 
                clearFormAndState();
                // If the form was active for the deleted item, perhaps switch to list view.
                setActiveView(listAllContainer);
            }
            // Refresh the currently visible table (either full list or search results)
            // This is tricky if search results were displayed. Simplest is to reload all.
            loadAllVehicles(); 

        } catch (error) {
            console.error('Erreur suppression véhicule:', error);
            displayMessage(`Erreur: ${error.message}`, 'error');
        }
    }

    clearFormButton.addEventListener('click', clearFormAndState);

    function clearFormAndState() {
        vehicleForm.reset();
        immatriculationInput.readOnly = false;
        
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = null;
        }
        imageFileInput.value = null; // Important to clear the file input selection
        imagePreview.src = '/placeholder.png';
        imagePreview.style.display = 'block'; // Keep preview area visible with placeholder

        currentEditingImmatriculation = null;
        addVehicleButton.style.display = 'inline-block';
        updateVehicleButton.style.display = 'none';
        // displayMessage('', 'info'); // Clears message, usually good after clearing form
    }

    searchVehicleButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        const type = searchTypeSelect.value;
        
        if (type === "all") {
            loadAllVehicles(true);
            searchInput.value = ""; // Clear search input for "all"
            return;
        }
        if (!query && type !== "all") { // query is needed if not searching "all"
            displayMessage("Veuillez entrer un critère de recherche.", "error");
            return;
        }

        let searchUrl = API_ENDPOINT;
        if (type === "registration_contains") {
            searchUrl = `${API_ENDPOINT}/search?registration_contains=${encodeURIComponent(query)}`;
        } else if (type === "price_le") {
            if (isNaN(parseFloat(query)) || parseFloat(query) < 0) {
                 displayMessage("Veuillez entrer un prix valide pour la recherche.", "error");
                 return;
            }
            searchUrl = `${API_ENDPOINT}/search?price_le=${encodeURIComponent(query)}`;
        }
        
        // Ensure search container and list container (for table) are visible for search results
        setActiveView(searchContainer); // This makes search controls visible
        listAllContainer.style.display = 'block'; // And also the table container

        displayMessage('Recherche en cours...', 'info');
        try {
            const response = await fetch(searchUrl);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            const vehicles = await response.json();
            renderTable(vehicles);
            displayMessage(vehicles.length > 0 ? `${vehicles.length} véhicule(s) trouvé(s).` : 'Aucun véhicule ne correspond à votre recherche.', vehicles.length > 0 ? 'success' : 'info');
        } catch (error) {
            console.error('Erreur recherche véhicules:', error);
            displayMessage(`Erreur: ${error.message}`, 'error');
            renderTable([]); // Render empty table on error
        }
    });
    

    
    // Sidebar navigation logic
    navAddVehicle.addEventListener('click', (e) => {
        e.preventDefault();
        clearFormAndState(); // Prepare form for adding
        setActiveView(vehicleFormContainer);
        displayMessage('Prêt à ajouter un nouveau véhicule.', 'info');
    });

    navSearchVehicle.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveView(searchContainer);
        // listAllContainer.style.display = 'block'; // Also show table area for results
        tableBody.innerHTML = ''; // Clear previous search results from table
        displayMessage('Prêt pour la recherche. Les résultats s\'afficheront ci-dessous.', 'info');
    });

    navListAllVehicles.addEventListener('click', (e) => {
        e.preventDefault();
        loadAllVehicles(true); // This also sets active view to listAllContainer
    });

    // Initial setup: Load all vehicles and show the list view.
    loadAllVehicles(true);
});
