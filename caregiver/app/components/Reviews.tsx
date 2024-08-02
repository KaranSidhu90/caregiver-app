import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

type Props = {
  reviews: Array<{
    name: string;
    date: string;
    rating: number;
    comment: string;
    reviewerName: string;
  }>;
};

const Reviews: React.FC<Props> = ({ reviews }) => {
  return (
    <View style={styles.container}>
      {reviews.length > 0 ? (
        reviews.map((review, index) => {
          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}&background=295259&color=fff&size=50&rounded=true`;

          return (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: avatarUrl }} style={styles.reviewerImage} />
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                  <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
                </View>
              </View>
              <View style={styles.reviewBody}>
                <View style={styles.reviewRatingContainer}>
                  <Text style={styles.reviewRating}>★ {review.rating}</Text>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.noReviewsText}>No Reviews</Text>
      )}
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
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    color: '#4A4A4A',
  },
  reviewDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#B0B0B0',
  },
  reviewBody: {
    marginTop: 10,
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 14,
    fontFamily: 'Poppins-Semibold',
    color: '#FFD700', // Gold color for the star rating
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
  noReviewsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

export default Reviews;
