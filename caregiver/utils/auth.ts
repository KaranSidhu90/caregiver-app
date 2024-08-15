import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_KEY = 'authToken';

// Sets or removes the auth token in AsyncStorage and axios headers
export const setAuthToken = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Retrieves the auth token from AsyncStorage
export const getAuthToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

// Initializes axios with the auth token from AsyncStorage
export const initializeAuthToken = async () => {
  const token = await getAuthToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Clears the auth token from AsyncStorage and axios headers
export const signOut = async () => {
  await setAuthToken(null);
};