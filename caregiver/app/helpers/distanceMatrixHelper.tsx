import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyDwIRTnSxpLAasAMhuMBwHSkdWU6QABQig';

export const getDistanceMatrix = async (origins: string[], destinations: string[]) => {
  const originStr = origins.join('|');
  const destinationStr = destinations.join('|');

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&key=${GOOGLE_API_KEY}`;

  try {
    
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching distance matrix:', error);
    throw new Error('Error fetching distance matrix');
  }
};
