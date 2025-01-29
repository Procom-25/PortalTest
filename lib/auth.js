// Function to authenticate a company
export async function authenticateCompany(name , password) {
    try {
        // Send the POST request to the backend with name and password
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
        });

        const data = await response.json(); // Parse the JSON response

        // Check if the response indicates success
        if (data.success) {
            return true;  // Authentication is successful
        }

        // If authentication failed, log the error message and return false
        console.error(data.error);
        return false;

    } catch (err) {
        console.error('Authentication error:', err);
        return false;
    }
}
