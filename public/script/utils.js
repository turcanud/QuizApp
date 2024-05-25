export async function fetchWithAuth(url, method = 'GET', json = null) {
    const isGet = method.toUpperCase() === "GET";

    try {
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json'
            },
            body: !isGet ? JSON.stringify(json) : undefined,
        });

        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} ${response.statusText}, ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
