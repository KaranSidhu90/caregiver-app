import React from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { getAvatarUrl, calculateAge } from '../helpers/common';
import moment from 'moment';

type Props = {
  seniorDetails: any;
  date: string;
  avatarSize: Animated.AnimatedInterpolation<string | number>;
  nameFontSize: Animated.AnimatedInterpolation<string | number>;
  showHide: Animated.AnimatedInterpolation<string | number>;
};

// Formats the care type string by inserting spaces before capital letters and capitalizing the first letter
const formatCareType = (careType: string) => {
  return careType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const BookingSeniorDetails: React.FC<Props> = ({ seniorDetails, date, avatarSize, nameFontSize, showHide }) => {
  // Get the avatar URL or use a placeholder if not available
  const avatarUrl = getAvatarUrl(seniorDetails.name || "Unknown", seniorDetails.imageUrl);
  // Format the date to a readable format
  const formattedDate = moment.utc(date).format("dddd, Do MMMM, YYYY");
  // Format the first care need if available, otherwise set to 'Unknown Care'
  const formattedCareNeeds = seniorDetails.careNeeds ? formatCareType(seniorDetails.careNeeds[0]) : 'Unknown Care';

  return (
    <View style={styles.container}>
      {/* Animated avatar image */}
      <Animated.Image source={{ uri: avatarUrl }} style={[styles.avatar, { width: avatarSize, height: avatarSize }]} />
      {/* Animated senior name text */}
      <Animated.Text style={[styles.name, { fontSize: nameFontSize }]}>
        {seniorDetails.name || "Unknown"}
      </Animated.Text>
      {/* Animated senior age and gender text */}
      <Animated.Text style={[styles.name, { fontSize: nameFontSize }]}>
        {`${calculateAge(seniorDetails.dob)} Years, ${seniorDetails.gender || "Unknown"}`}
      </Animated.Text>
      {/* Animated requirement title */}
      <Animated.Text style={[styles.requirementTitle, { display: showHide }]}>Requirement</Animated.Text>
      {/* Display formatted care needs */}
      <Text style={styles.requirement}>{formattedCareNeeds}</Text>
      {/* Animated date title */}
      <Animated.Text style={[styles.requirementTitle, { display: showHide }]}>Date</Animated.Text>
      {/* Display formatted date */}
      <Text style={styles.requirement}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  avatar: {
    borderRadius: 58,
    marginBottom: 10,
    backgroundColor: '#A6A3B8',
  },
  name: {
    fontFamily: 'Poppins-Semibold',
    textAlign: 'center',
    marginBottom: 5,
  },
  ageGender: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 10,
    color: '#C2A27C',
  },
  requirementTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#C2A27C',
  },
  requirement: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default BookingSeniorDetails;
