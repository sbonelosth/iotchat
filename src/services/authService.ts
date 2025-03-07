import { User } from "../types/index";

const endpointUrl = import.meta.env.VITE_BASE_URL;
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export const authService = {
    async login(username: string, password: string) {
        try {
            const response = await fetch(`${endpointUrl}/login`, {
                ...options,
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                const error = await response.json();
                return { success: false, data: error?.user, error: { title: response.statusText, message: error.error } };
            }
            const result = await response.json();
            return { success: true, data: result };
        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred';
            return { success: false, error: { title: 'Oops', message: errorMessage } };
        }
    },

    async signup(signupData: Partial<User>) {
        try {
            const response = await fetch(`${endpointUrl}/signup`, {
                ...options,
                body: JSON.stringify(signupData)
            });
            if (!response.ok) {
                const error = await response.json();
                return { success: false, error: { title: response.statusText, message: error.error } };
            }
            const result = await response.json();
            return { success: true, data: result };
        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred';
            return { success: false, error: { title: 'Oops', message: errorMessage } };
        }
    },

    async verify (email: string, code: string) {
        try {
            const response = await fetch(`${endpointUrl}/verify`, {
                ...options,
                body: JSON.stringify({ email, code })
            });
            if (!response.ok) {
                const error = await response.json();
                return { success: false, error: { title: response.statusText, message: error.error } };
            }
            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            let errorMessage = 'An unexpected error occurred';
            return { success: false, error: { title: 'Oops', message: errorMessage } };
        }
    }
};
