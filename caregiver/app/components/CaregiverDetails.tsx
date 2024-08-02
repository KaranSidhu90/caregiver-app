import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import axios from 'axios';
import API_ENDPOINTS from '../../config/apiEndpoints';

type Props = {
  name: string;
  experience: string;
  rating: number;
  displayImage: string;
  defaultImage: any; 
  caregiverId: string;
};

const CaregiverDetails: React.FC<Props> = ({ name, experience, rating, displayImage, defaultImage, caregiverId }) => {
  const [averageRating, setAverageRating] = useState<string | number | null>(null);

  const avatarUrl = displayImage
    ? displayImage
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=295259&color=fff&size=200&rounded=true`;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.REVIEWS.GET_BY_RECEIVER_ID(caregiverId));
        const reviews = response.data;

        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          const average = totalRating / reviews.length;
          setAverageRating(parseFloat(average.toFixed(1)));
        } else {
          setAverageRating('Not Rated');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          setAverageRating('Not Rated'); // On 404 error, set rating to "Not Rated"
        } else {
          console.error('Error fetching reviews:', error);
          setAverageRating('Trouble Loading Rating');
        }
      }
    };

    fetchReviews();
  }, [caregiverId]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: avatarUrl }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.experience}>{experience}</Text>
      <Text style={styles.rating}>{`Rating: ${averageRating !== null ? averageRating : 'N/A'}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  profileImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#4A4A4A',
  },
  experience: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
});

export default CaregiverDetails;
