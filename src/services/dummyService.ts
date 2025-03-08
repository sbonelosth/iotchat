const endpointUrl = import.meta.env.VITE_BASE_URL;
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

export const dummyService = {
    wakeup() {
        return fetch(`${endpointUrl}/wakeup`, {
            ...options,
        });
    }
}