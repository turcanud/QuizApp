//Imports
import { fetchWithAuth } from './script/utils.js'

const formRegister = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = formRegister.username.value.trim();
    const email = formRegister.email.value.trim();
    const password = formRegister.password.value.trim();
    const confirmPassword = formRegister.confirmPassword.value.trim();

    if (!username || !email || !password || !confirmPassword) {
        errorMessage.textContent = 'All fields are required.';
        errorMessage.classList.remove('hidden');
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');
    const json = { name: username, email: email, password: password }
    const response = await fetchWithAuth('/register', 'POST', json);
    if (response) window.location.href = 'http://localhost:3000/login';
    form.reset();
});
