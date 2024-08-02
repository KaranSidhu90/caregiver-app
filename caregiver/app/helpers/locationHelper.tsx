import axios from 'axios';

const LOCATIONIQ_API_KEY = 'pk.865e92db6e699f2370da531cbb03e26a';

export const getLatLngFromAddress = async (address: string) => {
  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`);
    const location = response.data[0];
    return {
      lat: location.lat,
      lon: location.lon,
    };
  } catch (error) {
    console.error('Error fetching lat/lng from address:', error);
    throw new Error('Error fetching lat/lng from address');
  }
};
