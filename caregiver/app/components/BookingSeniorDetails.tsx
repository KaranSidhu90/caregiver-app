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

const formatCareType = (careType: string) => {
  return careType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const BookingSeniorDetails: React.FC<Props> = ({ seniorDetails, date, avatarSize, nameFontSize, showHide }) => {
  const avatarUrl = getAvatarUrl(seniorDetails.name || "Unknown", seniorDetails.imageUrl);
  const formattedDate = moment.utc(date).format("dddd, Do MMMM, YYYY");
  const formattedCareNeeds = seniorDetails.careNeeds ? formatCareType(seniorDetails.careNeeds[0]) : 'Unknown Care';

  return (
    <View style={styles.container}>
      <Animated.Image source={{ uri: avatarUrl }} style={[styles.avatar, { width: avatarSize, height: avatarSize }]} />
      <Animated.Text style={[styles.name, { fontSize: nameFontSize }]}>
        {seniorDetails.name || "Unknown"}
      </Animated.Text>
      <Animated.Text style={[styles.name, { fontSize: nameFontSize }]}>
        {`${calculateAge(seniorDetails.dob)} Years, ${seniorDetails.gender || "Unknown"}`}
      </Animated.Text>
      <Animated.Text style={[styles.requirementTitle, { display: showHide }]}>Requirement</Animated.Text>
      <Text style={styles.requirement}>{formattedCareNeeds}</Text>
      <Animated.Text style={[styles.requirementTitle, { display: showHide }]}>Date</Animated.Text>
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
