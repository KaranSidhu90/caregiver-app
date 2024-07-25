import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

type Props = {
  name: string;
  experience: string;
  rating: number;
  displayImage: string;
  defaultImage: any; // Add this prop to pass the default image
};

const CaregiverDetails: React.FC<Props> = ({ name, experience, rating, displayImage, defaultImage }) => {
  const [imageSource, setImageSource] = React.useState(displayImage ? { uri: displayImage } : defaultImage);

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={styles.profileImage}
        onError={() => setImageSource(defaultImage)}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.experience}>{experience}</Text>
      <Text style={styles.rating}>{`Rating: ${rating}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
