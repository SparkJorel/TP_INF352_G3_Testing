// Connexion API
const apiUrl = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('show-password');
    const loginBtn = document.getElementById('login-btn');
    const passwordRules = document.getElementById('password-rules').children;
    const passwordStrength = document.getElementById('password-strength');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    // Événements
    showPasswordCheckbox.addEventListener('change', togglePasswordVisibility);
    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    loginForm.addEventListener('submit', handleLogin); // ✅ Important : écoute l'événement "submit" du formulaire

    // Fonction pour afficher/masquer le mot de passe
    function togglePasswordVisibility() {
        passwordInput.type = this.checked ? 'text' : 'password';
    }

    // Validation du formulaire
    function validateForm() {
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        loginBtn.disabled = !(isUsernameValid && isPasswordValid);
    }

    // Validation du nom d'utilisateur
    function validateUsername() {
        const username = usernameInput.value.trim();
        if (username.length < 4) {
            showError(usernameError, ' ');
            return false;
        } else {
            hideError(usernameError);
            return true;
        }
    }

    // Validation du mot de passe
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
        if (isValid) {
            ruleElement.classList.add('valid');
            ruleElement.classList.remove('invalid');
        } else {
            ruleElement.classList.add('invalid');
            ruleElement.classList.remove('valid');
        }
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

    // ✅ Gestion de la soumission du formulaire
    async function handleLogin(e) {
        e.preventDefault();

        const name = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!validateUsername() || !validatePassword()) {
            return;
        }

        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
        loginBtn.disabled = true;

        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Échec de la connexion : " + (data.error || 'Erreur inconnue'));
                loginBtn.innerHTML = '<span class="btn-text">Se Connecter</span><i class="fas fa-arrow-right btn-icon"></i>';
                loginBtn.disabled = false;
                return;
            }

            alert("Connexion réussie ! Bienvenue " + data.user.name);
            localStorage.setItem('user', JSON.stringify(data.user));

            // ✅ Redirection après un petit délai
            setTimeout(() => {
                window.location.href = '../Pages/Dashboard/dashboard.html';
            }, 1000);

        } catch (err) {
            alert("Erreur réseau : " + err.message);
            loginBtn.innerHTML = '<span class="btn-text">Se Connecter</span><i class="fas fa-arrow-right btn-icon"></i>';
            loginBtn.disabled = false;
        }
    }

    validateForm(); // Initialisation
});