import AsyncStorage from '@react-native-async-storage/async-storage';

const generateUserId = async () => {
  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    await AsyncStorage.setItem('userId', userId);
  }
  return userId;
};

export const saveUserData = async (data: any) => {
  try {
    const userId = await generateUserId();
    const existingData = await AsyncStorage.getItem(userId);
    const updatedData = existingData ? { ...JSON.parse(existingData), ...data } : data;
    await AsyncStorage.setItem(userId, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return null;
    const userData = await AsyncStorage.getItem(userId);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      await AsyncStorage.removeItem(userId);
      await AsyncStorage.removeItem('userId');
    }
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const getAllUsers = async () => {
  try {
    debugger;
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(key => key.startsWith('user_'));
    const users = await AsyncStorage.multiGet(userKeys);
    return users.map(([key, value]) => value ? JSON.parse(value) : null).filter(user => user !== null);
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const checkLoginCredentials = async (phoneNumber: string, passcode: string) => {
  try {
    debugger;
    const users = await getAllUsers();
    debugger;
    return users.find((user: any) => user.phoneNumber === phoneNumber && user.passcode === passcode);
  } catch (error) {
    console.error('Error checking login credentials:', error);
    return null;
  }
};
