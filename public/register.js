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
    const response = await fetchApi('/register', json);
    if (response.message) window.location.href = 'http://localhost:3000/login';
    form.reset();
});


//Post
async function fetchApi(url, json) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Re-throwing the error so the caller can handle it
    }
}