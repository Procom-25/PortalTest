import { Company } from "./model/Company";


// Function to authenticate a company
export async function authenticateCompany(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
        });

        const {message} = await response.json();

        if (message === "Login successful") {
            return true;
        }

        return false;

    } catch (err) {
        console.error('Authentication error:', err);
        return false;
    }
}
