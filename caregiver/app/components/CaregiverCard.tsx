import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import API_ENDPOINTS from '../../config/apiEndpoints';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAvatarUrl } from '../helpers/common';

type Props = {
  caregiver: {
    _id: string;
    name: string;
    experience: string;
    rating?: number;
    imageUrl?: string;
    distance?: string;
  };
  navigation: any;
  distance?: string;
};

const CaregiverCard: React.FC<Props> = ({ caregiver, navigation, distance }) => {
  // State to hold the average rating of the caregiver
  const [averageRating, setAverageRating] = useState<string | number | null>(null);

  // Get the avatar URL or use a placeholder if not available
  const avatarUrl = getAvatarUrl(caregiver.name, caregiver.imageUrl);

  useEffect(() => {
    // Function to fetch the average rating for the caregiver
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.REVIEWS.GET_AVERAGE_RATING(caregiver._id));
        const { averageRating } = response.data;

        // Set the average rating or default to 'Not Rated'
        setAverageRating(averageRating !== undefined ? parseFloat(averageRating.toFixed(1)) : 'Not Rated');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          setAverageRating('Not Rated');
        } else {
          console.error('Error fetching average rating:', error);
          setAverageRating('Trouble Loading Rating');
        }
      }
    };

    fetchAverageRating(); // Fetch the rating when the component mounts
  }, [caregiver._id]);

  // Handle the press event for the card
  const handlePress = () => {
    // Add the distance to the caregiver object before navigating
    const caregiverWithDistance = {
      ...caregiver,
      distance: distance || caregiver.distance, // Use the provided distance or existing one
    };

    navigation.navigate('Profile', { caregiver: caregiverWithDistance });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={styles.caregiverImage}
        resizeMode="cover"
      />
      <View style={styles.caregiverInfo}>
        <Text style={styles.caregiverName}>{caregiver.name}</Text>
        <Text style={styles.caregiverExperience}>{caregiver.experience} Year(s) Experience</Text>
        <Text style={styles.caregiverRating}>★ {averageRating !== null ? averageRating : 'N/A'}</Text>
      </View>
      {distance && (
        <View style={styles.distanceContainer}>
          <Icon name="location-pin" size={20} color="#295259" />
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  caregiverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  caregiverInfo: {
    marginLeft: 10,
    flex: 2,
  },
  caregiverName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#4A4A4A',
  },
  caregiverExperience: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginTop: 5,
  },
  caregiverRating: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginTop: 5,
  },
  distanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
});

export default CaregiverCard;
