import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DashboardHeader from '../components/DashboardHeader';
import CaregiverCard from '../components/CaregiverCard';
import { initializeAuthToken } from '../../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from '../../config/apiEndpoints';

type Props = {
  navigation: any;
};

const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User'); // Default user name
  const [userId, setUserId] = useState(''); // User ID
  const [trialVisitsRemaining, setTrialVisitsRemaining] = useState<number | null>(null);

  const getTimeOfDayGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const timeOfDayGreeting = getTimeOfDayGreeting();

  useEffect(() => {
    const fetchData = async () => {
      await initializeAuthToken(); // Initialize the token before making requests
      await fetchUserDetails();
      await fetchTrialVisits();
      await fetchCaregivers();
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // Retrieve user details from AsyncStorage
      const fullName = await AsyncStorage.getItem('userName');
      const storedUserId = await AsyncStorage.getItem('userId');
      if (fullName) {
        const firstName = fullName.split(' ')[0]; // Use only the first part of the name
        setUserName(firstName);
      }
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchTrialVisits = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        // Fetch trial visits data
        const trialVisitsResponse = await axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(storedUserId));
        const bookingsCount = trialVisitsResponse.data.length;
        const remaining = 7 - bookingsCount;
        if (remaining > 0) {
          setTrialVisitsRemaining(remaining);
        } else {
          setTrialVisitsRemaining(null); // Hide if no trial visits left
        }
      }
    } catch (error) {
      console.error('Error fetching trial visits:', error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      // Fetch caregivers data
      const caregiversResponse = await axios.get(API_ENDPOINTS.USERS.GET_ALL_CAREGIVERS);
      setCaregivers(caregiversResponse.data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  const handleCaregiverPress = (caregiver: any) => {
    console.log('Caregiver pressed:', caregiver); 
    navigation.navigate('Profile', { caregiver });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader name={userName} timeOfDay={timeOfDayGreeting} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.dataContainer}>
          {trialVisitsRemaining !== null && (
            <View style={styles.trialVisitsContainer}>
              <Text style={styles.trialVisitsLabel}>Trial Visits Remaining:</Text>
              <Text style={styles.trialVisitsCount}>{trialVisitsRemaining}</Text>
            </View>
          )}
          <Text style={styles.sectionTitle}>Recommended Caregivers</Text>
          <ScrollView style={styles.recommendedCaregiversContainer}>
            {caregivers.slice(0, 5).map((caregiver, index) => (
              <TouchableOpacity key={index} onPress={() => handleCaregiverPress(caregiver)}>
                <CaregiverCard
                  key={index}
                  caregiver={caregiver}
                  navigation={navigation}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('AllCaregivers', { caregivers })}
          >
            <Text style={styles.seeAllButtonText}>See All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    height: '100%',
    zIndex: 999,
    width: '100%',
  },
  dataContainer: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    borderRadius: 20,
    padding: 20,
    zIndex: 999,
    height: '120%',
    width: '100%',
  },
  trialVisitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F7FA',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  trialVisitsLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4A4A4A',
    marginRight: 10,
  },
  trialVisitsCount: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#00796B',
  },
  recommendedCaregiversContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
    color: '#4A4A4A',
  },
  seeAllButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#295259',
    borderRadius: 10,
    alignItems: 'center',
  },
  seeAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
