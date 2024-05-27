import { AUTH_API } from "./serverURL";

export default function formatDateString(isoDateString: string): string {
    const date = new Date(isoDateString);
    
    // Get day, month, year, hours, and minutes
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    // Construct the new date format
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export async function loginUser(email:string, password:string) {
    const response = await fetch((`${AUTH_API.LOGIN}`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': "1",
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        const { access_token, userId } = data;
        const expiryTime = new Date().getTime() + (15 * 60 * 1000); // Current time + 15 mins
        localStorage.setItem('token', access_token);
        localStorage.setItem('userID', userId);
        localStorage.setItem('token_expiry', expiryTime.toString()); // Store expiration time
    } else {
        throw new Error(data.error);
    }
}
