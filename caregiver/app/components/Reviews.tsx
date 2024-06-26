import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  reviews: Array<{
    name: string;
    date: string;
    rating: number;
    review: string;
  }>;
};

const Reviews: React.FC<Props> = ({ reviews }) => {
  return (
    <View style={styles.container}>
      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewItem}>
          <Text style={styles.reviewerName}>{review.name}</Text>
          <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
          <Text style={styles.reviewRating}>★ {review.rating}</Text>
          <Text style={styles.reviewText}>{review.review}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  reviewItem: {
    marginBottom: 15,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    color: '#4A4A4A',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#B0B0B0',
    marginBottom: 2,
  },
  reviewRating: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
});

export default Reviews;
