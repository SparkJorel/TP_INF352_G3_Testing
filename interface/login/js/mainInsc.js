const apiUrl = 'http://localhost:3000/users';


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('show-password');
    const loginBtn = document.getElementById('login-btn');
    const passwordRules = document.getElementById('password-rules').children;
    const passwordStrength = document.getElementById('password-strength');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    showPasswordCheckbox.addEventListener('change', togglePasswordVisibility);
    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    // ❗ Correction ici : on écoute submit sur le formulaire, pas sur le bouton
    loginForm.addEventListener('submit', handleLogin);

    function togglePasswordVisibility() {
        passwordInput.type = this.checked ? 'text' : 'password';
    }

    function validateForm() {
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        loginBtn.disabled = !(isUsernameValid && isPasswordValid);
    }

    function validateUsername() {
        const username = usernameInput.value.trim();
        if (username.length < 4) {
            showError(usernameError, 'Le nom d\'utilisateur doit contenir au moins 4 caractères');
            return false;
        } else {
            hideError(usernameError);
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        let isValid = true;
        let strength = 0;

        const rules = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.keys(rules).forEach((rule, index) => {
            updateRule(passwordRules[index], rules[rule]);
            if (rules[rule]) strength += 25;
        });

        updatePasswordStrength(strength);

        if (!Object.values(rules).every(rule => rule)) {
            showError(passwordError, 'Le mot de passe ne respecte pas toutes les règles');
            isValid = false;
        } else {
            hideError(passwordError);
        }

        return isValid;
    }

    function updateRule(ruleElement, isValid) {
        ruleElement.classList.toggle('valid', isValid);
        ruleElement.classList.toggle('invalid', !isValid);
    }

    function updatePasswordStrength(strength) {
        passwordStrength.style.width = `${strength}%`;
        passwordStrength.style.backgroundColor =
            strength < 50 ? '#ff4757' :
            strength < 75 ? '#ffa502' : '#38d39f';
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function hideError(element) {
        element.style.display = 'none';
    }

    // ✅ Fonction séparée pour créer l'utilisateur
    function createUser(name, password) {
        fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            })
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Une erreur est survenue.');
                }

                // ✅ Succès : redirection
                Swal.fire({
                    title: 'Redirection...',
                    text: 'Vous allez être redirigé vers la page de connexion',
                    icon: 'success',
                    timer: 20000000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        window.location.href = 'seConnecter.html';
                    }
                });

            })
            .catch(err => {
                console.error('Fetch error:', err.message);
                alert('Erreur : ' + err.message);
            });
        }

    function handleLogin(e) {
        e.preventDefault();

        if (validateUsername() && validatePassword()) {
            const name = usernameInput.value.trim();
            const password = passwordInput.value;

            // Animation du bouton
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
            loginBtn.disabled = true;

            createUser(name, password);
        }
    }

    // Validation initiale
    validateForm();
});