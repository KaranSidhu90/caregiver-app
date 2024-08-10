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
  const tabs = [
    { label: "Skills", value: "Skills" },
    { label: "Reviews", value: "Reviews" },
  ];

  useEffect(() => {
    if (caregiverId && !reviewsFetched) {
      fetchReviews(caregiverId);
    }
  }, [caregiverId, reviewsFetched]);

  const fetchReviewerDetails = async (reviewerId: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.GET_SENIOR_BY_ID(reviewerId));
      return response.data;
    } catch (error) {
      console.error('Error fetching reviewer details:', error);
      return null;
    }
  };

  const fetchReviews = async (id: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.REVIEWS.GET_BY_RECEIVER_ID(id));
      const reviews = await Promise.all(
        response.data.map(async (review: any) => {
          const reviewerDetails = await fetchReviewerDetails(review.reviewerId);
          return {
            ...review,
            reviewerName: reviewerDetails ? reviewerDetails.name : 'Anonymous',
          };
        })
      );
      setReviews(reviews);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        setReviews([]);
      } else {
        console.error('Error fetching reviews:', error);
      }
    } finally {
      setReviewsFetched(true);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Reviews' && !reviewsFetched && caregiverId) {
      fetchReviews(caregiverId);
    }
  };

  const handleBookVisit = () => {
    navigation.navigate('BookVisitScreen', { caregiver: caregiverData });
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
          displayImage={caregiverData.imageUrl}
          defaultImage={require('../../assets/defaultProfileImage.png')}
          caregiverId={caregiverData._id}
        />
        <CaregiverStats
          category={caregiverData.category}
          activeClients={caregiverData.activeClients}
          totalClients={caregiverData.totalClients}
        />
        <Tabs tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />
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
