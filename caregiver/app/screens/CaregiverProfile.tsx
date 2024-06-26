import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Text } from 'react-native';
import axios from 'axios';
import CaregiverDetails from '../components/CaregiverDetails';
import CaregiverStats from '../components/CaregiverStats';
import Tabs from '../components/Tabs';
import Skills from '../components/Skills';
import Reviews from '../components/Reviews';
import ActionButtons from '../components/ActionButtons';

type Props = {
  navigation: any;
  route: any;
};

const CaregiverProfile: React.FC<Props> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Skills');
  const [caregiverData, setCaregiverData] = useState<any>(null);
  const caregiverId = route.params?.caregiver?.id;

  useEffect(() => {
    if (caregiverId) {
      axios
        .get(`https://api.mockaron.com/mock/m0cbafdz7b/all-caregivers?id=1234`)
        .then((response) => {
          setCaregiverData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching caregiver details:', error);
        });
    }
  }, [caregiverId]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBookVisit = () => {
    navigation.navigate('BookVisitScreen');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!caregiverData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <CaregiverDetails
          name={caregiverData.name}
          experience={`${caregiverData.experience} Year(s) Experience in ${caregiverData.category}`}
          rating={caregiverData.rating}
          displayImage={caregiverData.displayImage}
        />
        <CaregiverStats
          category={caregiverData.category}
          activeClients={caregiverData.activeClients}
          totalClients={caregiverData.totalClients}
        />
        <Tabs activeTab={activeTab} onTabPress={handleTabPress} />
        {activeTab === 'Skills' ? (
          <Skills skills={caregiverData.skills ?? ''} />
        ) : (
          <Reviews reviews={Object.values(caregiverData.reviews ?? {})} />
        )}
      </ScrollView>
      <ActionButtons onBookVisit={handleBookVisit} onGoBack={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CaregiverProfile;
