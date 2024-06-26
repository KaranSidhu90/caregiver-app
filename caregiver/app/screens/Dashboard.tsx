import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DashboardHeader from '../components/DashboardHeader';
import CaregiverCard from '../components/CaregiverCard';

type Props = {
  navigation: any;
};

const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = 'Robert';

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
    axios.get('https://api.mockaron.com/mock/m0cbafdz7b/all-caregivers')
      .then(response => {
        setCaregivers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching caregivers:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader name={userName} timeOfDay={timeOfDayGreeting} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.dataContainer}>
          <Text style={styles.trialText}>As a new user we provide free of cost trial visits</Text>
          <View style={styles.trialVisitsContainer}>
            <Text style={styles.trialVisitsLabel}>Trial Visits Remaining</Text>
            <View style={styles.trialVisitsCountContainer}>
              <Text style={styles.trialVisitsCount}>7</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Recommended Caregivers</Text>
          <ScrollView style={styles.recommendedCaregiversContainer}>
            {caregivers.slice(0, 5).map((caregiver, index) => (
              <CaregiverCard
                key={index}
                caregiver={caregiver}
                navigation={navigation}
              />
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
  trialText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 20,
    textAlign: 'left',
    zIndex: 999,
  },
  trialVisitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  trialVisitsLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4A4A4A',
  },
  trialVisitsCountContainer: {
    backgroundColor: '#E0F7FA',
    padding: 10,
    borderRadius: 10,
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
