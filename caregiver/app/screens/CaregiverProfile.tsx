import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Text } from 'react-native';
import axios from 'axios';
import CaregiverDetails from '../components/CaregiverDetails';
import CaregiverStats from '../components/CaregiverStats';
import Tabs from '../components/Tabs';
import Skills from '../components/Skills';
import Reviews from '../components/Reviews';
import ActionButtons from '../components/ActionButtons';
import API_ENDPOINTS from '../../config/apiEndpoints';

type Props = {
  navigation: any;
  route: any;
};

const CaregiverProfile: React.FC<Props> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Skills');
  const [caregiverData, setCaregiverData] = useState<any>(route.params?.caregiver || null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsFetched, setReviewsFetched] = useState(false);
  const caregiverId = caregiverData?._id;

  useEffect(() => {
    console.log('CaregiverProfile mounted with data:', caregiverData);
  }, []);

  const fetchReviews = async (id: string) => {
    try {
      console.log('Fetching reviews for caregiver ID:', id);
      const response = await axios.get(API_ENDPOINTS.REVIEWS.GET_BY_RECEIVER_ID(id));
      console.log('Reviews fetched:', response.data);
      setReviews(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        console.log('No reviews found for this caregiver');
        setReviews([]);
      } else {
        console.error('Error fetching reviews:', error);
      }
    } finally {
      setReviewsFetched(true);
    }
  };

  const handleTabPress = (tab: string) => {
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
    if (tab === 'Reviews' && !reviewsFetched && caregiverId) {
      fetchReviews(caregiverId);
    }
  };

  const handleBookVisit = () => {
    console.log('Navigating to BookVisitScreen with caregiver data:', caregiverData);
    navigation.navigate('BookVisitScreen', { caregiver: caregiverData });
  };

  const handleGoBack = () => {
    console.log('Going back to previous screen');
    navigation.goBack();
  };

  if (!caregiverData) {
    console.log('Caregiver data is not available yet');
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering CaregiverProfile with data:', caregiverData);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <CaregiverDetails
          name={caregiverData.name}
          experience={`${caregiverData.experience} Year(s) Experience in ${caregiverData.category}`}
          rating={caregiverData.rating}
          displayImage={caregiverData.imageUrl}
          defaultImage={require('../../assets/defaultProfileImage.png')} 
        />
        <CaregiverStats
          category={caregiverData.category}
          activeClients={caregiverData.activeClients}
          totalClients={caregiverData.totalClients}
        />
        <Tabs activeTab={activeTab} onTabPress={handleTabPress} />
        {activeTab === 'Skills' ? (
          <Skills skills={caregiverData.skills ?? []} />
        ) : (
          <Reviews reviews={reviews} />
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
