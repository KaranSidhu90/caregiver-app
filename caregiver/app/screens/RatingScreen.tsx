import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import Rating from 'react-native-star-rating-widget';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { toast } from '@backpackapp-io/react-native-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Define the type for the route parameters
type RatingScreenRouteParams = {
  bookingId: string;
  caregiverId: string;
  seniorId: string;
};

const RatingScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RatingScreenRouteParams }, 'params'>>();
  const navigation = useNavigation();

  const { bookingId, caregiverId, seniorId } = route.params;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = async () => {
    console.log('Submitting Review with data:', {
      bookingId,
      reviewerId: seniorId,
      receiverId: caregiverId,
      rating,
      review,
    });
    try {
      await axios.post(API_ENDPOINTS.REVIEWS.ADD, {
        bookingId,
        reviewerId: seniorId,
        receiverId: caregiverId,
        rating,
        comment: review,
      });
      toast.success('Thank you for your feedback!');
      navigation.goBack(); // Navigate back to the previous screen or dashboard
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Icon name="star" size={100} color="#fff" />
        <Text style={styles.headerText}>Rating</Text>
      </View>
      <View style={styles.container}>
        <Rating
          rating={rating}
          onChange={setRating}
          starSize={40}
          style={styles.rating}
          color="#295259" // Primary green color of the app
          enableHalfStar={false} // Only full stars
        />
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review..."
          value={review}
          onChangeText={setReview}
          multiline
          numberOfLines={4}
        />
        <Button title="Submit" onPress={handleSubmit} disabled={rating === 0} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#295259',
    paddingTop: 50,
  },
  headerText: {
    fontFamily: 'Poppins-Semibold',
    color: '#fff',
    fontSize: 24,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  rating: {
    marginBottom: 20,
    alignSelf: 'center', // Center stars horizontally
  },
  reviewInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});

export default RatingScreen;
