import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

type Props = {
  caregiver: {
    name: string;
    experience: string;
    rating: number;
    displayImage: string;
  };
  navigation: any;
};

const CaregiverCard: React.FC<Props> = ({ caregiver, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { caregiver })}
    >
      <Image
        source={{ uri: caregiver.displayImage }}
        style={styles.caregiverImage}
        resizeMode="cover"
      />
      <View style={styles.caregiverInfo}>
        <Text style={styles.caregiverName}>{caregiver.name}</Text>
        <Text style={styles.caregiverExperience}>{caregiver.experience} Year(s) Experience</Text>
        <Text style={styles.caregiverRating}>★ {caregiver.rating}</Text>
      </View>
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
    width: 150,
    height: 126,
    borderRadius: 10,
  },
  caregiverInfo: {
    marginLeft: 10,
  },
  caregiverName: {
    fontSize: 16,
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
});

export default CaregiverCard;
