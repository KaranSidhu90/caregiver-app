
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DashboardHeader from '../components/DashboardHeader';
import CaregiverCard from '../components/CaregiverCard';

type Props = {
  navigation: any;
};

const Dashboard: React.FC<Props> = ({ navigation }) => {
  const userName = 'Robert';
  const timeOfDayGreeting = 'Good Morning'; 

  const caregivers = [
    { _id:'123', name: 'Cally Smith', experience: '10 Year Experience', rating: 4.9 },
    { _id:'456', name: 'Nicole Baker', experience: '8 Year Experience', rating: 4.9 },
    { _id:'789', name: 'Sam Johnson', experience: '2 Year Experience', rating: 4.2 },
    { _id:'987', name: 'Jenny Hudson', experience: '5 Year Experience', rating: 3.5 },
  ];

  return (
    <View style={styles.container}>
      <DashboardHeader navigation={'none'} name={userName} timeOfDay={timeOfDayGreeting} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.dataContainer}>
          <Text style={styles.trialText}>As a new user we provide free of cost trial visits</Text>
          <View style={styles.trialVisitsContainer}>
            <Text style={styles.trialVisitsLabel}>Trial Visits Remaining</Text>
            <View style={styles.trialVisitsCountContainer}>
              <Text style={styles.trialVisitsCount}>7</Text>
            </View>
          </View>
          <View style={styles.recommendedCaregiversContainer}>
            <Text style={styles.sectionTitle}>Recommended Caregivers</Text>
            {caregivers.map((caregiver, index) => (
              <CaregiverCard key={index} caregiver={caregiver} navigation={navigation} />
            ))}
          </View>
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
  },
  dataContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: -80,
    zIndex: 999,
    height: '120%',
  },
  trialText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 20,
    textAlign: 'center',
  },
  trialVisitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
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
    marginBottom: 10,
  },
});

export default Dashboard;
