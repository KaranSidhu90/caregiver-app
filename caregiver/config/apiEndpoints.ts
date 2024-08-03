// config/apiEndpoints.ts

// const BASE_URL = 'http://192.168.40.59:5000'; 
const BASE_URL = 'http:/172.20.10.3:5000'; 
// const BASE_URL = 'http://142.3.72.83:5000'; 

const API_ENDPOINTS = {
    AUTH: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
    },
    AVAILABILITY: {
        ADD_OR_UPDATE: `${BASE_URL}/availability`,
        GET_BY_CAREGIVER_ID: (caregiverId: string) => `${BASE_URL}/availability/${caregiverId}`,
    },
    BOOKINGS: {
        CREATE: `${BASE_URL}/bookings`,
        GET_BY_CAREGIVER_ID: (caregiverId: string) => `${BASE_URL}/bookings/caregiver/${caregiverId}`,
        GET_BY_SENIOR_ID: (seniorId: string) => `${BASE_URL}/bookings/senior/${seniorId}`,
        UPDATE: (bookingId: string) => `${BASE_URL}/bookings/${bookingId}`,
        DELETE: (bookingId: string) => `${BASE_URL}/bookings/${bookingId}`,
        GET_SLOTS_DAY: (caregiverId: string, date: string) => `${BASE_URL}/bookings/slots/${caregiverId}/${date}`,
        GET_ALL_SLOTS: (caregiverId: string, status: string) => `${BASE_URL}/bookings/caregiver/slots/${caregiverId}/${status}`,
    },
    REVIEWS: {
        ADD: `${BASE_URL}/reviews`,
        GET_BY_RECEIVER_ID: (receiverId: string) => `${BASE_URL}/reviews/${receiverId}`,
    },
    USERS: {
        GET_ALL_SENIORS: `${BASE_URL}/api/users/seniors`,
        GET_ALL_CAREGIVERS: `${BASE_URL}/api/users/caregivers`,
        GET_SENIOR_BY_ID: (id: string) => `${BASE_URL}/api/users/seniors/${id}`,
        GET_CAREGIVER_BY_ID: (id: string) => `${BASE_URL}/api/users/caregivers/${id}`,
    },
};

export default API_ENDPOINTS;
