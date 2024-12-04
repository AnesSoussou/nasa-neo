import axios from "axios";

const API_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse';
const API_KEY = 'DEMO_KEY';

export const fetchNEOs = async () => {
    try {
        const response = await axios.get(`${API_URL}?api_key=${API_KEY}`);
        return response.data.near_earth_objects;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
};