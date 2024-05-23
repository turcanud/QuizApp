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
    const response = await fetchApi('/login', json);
    console.log(response);

    if (response.accessToken) {
        // Store accessToken in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        // Redirect to the desired location

        const accessToken = localStorage.getItem('accessToken');

        //await fetchAttempt('/quiz', accessToken);
        await fetchAttempt('http://localhost:3000/quiz', accessToken);

    } else {
        // Handle error if accessToken is not present in response
        console.error('Access token not found in response');
    }
    formLogin.reset();
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

async function fetchAttempt(url, accessToken) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            window.location.href = url;
        } else if (response.status === 401) {
            console.log('Unauthorized');
        } else if (response.status === 403) {
            console.log('Forbidden');
        } else {
            console.log('Unexpected response status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}