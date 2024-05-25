//Imports
import { fetchWithAuth } from './script/utils.js'


const formLogin = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');


formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = formLogin.email.value.trim();
    const password = formLogin.password.value.trim();

    if (!email || !password) {
        errorMessage.textContent = 'All fields are required.';
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');
    const json = { email: email, password: password }

    const response = await fetchWithAuth('/login', 'POST', json);
    if (response) {
        window.location.href = 'http://localhost:3000/quiz';
    }
    formLogin.reset();
});