import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

type Props = {
  name: string;
  experience: string;
  rating: number;
  displayImage: string;
};

const CaregiverDetails: React.FC<Props> = ({ name, experience, rating, displayImage }) => {
  return (
    <View style={styles.detailsContainer}>
      <Image
        source={{ uri: displayImage }}
        style={styles.profileImage}
        resizeMode="cover"
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.experience}>{experience}</Text>
      <Text style={styles.rating}>★ {rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 20,
  },
  profileImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
    marginBottom: 10,
  },
  name: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 22,
    color: '#4A4A4A',
    marginBottom: 5,
  },
  experience: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 5,
  },
  rating: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#4A4A4A',
  },
});

export default CaregiverDetails;
