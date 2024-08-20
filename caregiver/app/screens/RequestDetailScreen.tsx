import React, { useRef } from 'react';
import { StyleSheet, View, Animated, ScrollView } from 'react-native';
import BookingSeniorDetails from '../components/BookingSeniorDetails';
import BookingDetailsTabs from '../components/BookingDetailsTabs';
import BookingMapSection from '../components/BookingMapSection';
import BookingActionButtons from '../components/BookingActionButtons';

type Props = {
  route: any;
  navigation: any;
};

const RequestDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  // Destructure request details from route params
  const { request } = route.params;
  const { seniorDetails, date, additionalInfo, caregiverAddress } = request;
  const { ailmentCategories, ailments, careNeeds } = seniorDetails || {};
  
  console.log('request', request); // Log the request for debugging

  // Format senior's address
  const seniorAddress = `${seniorDetails.addressLine1}, ${seniorDetails.addressLine2}, ${seniorDetails.city}, ${seniorDetails.state} ${seniorDetails.zipCode}`;

  // Create a scrollY animated value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate avatar size based on scroll position
  const avatarSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [116, 58],
    extrapolate: 'clamp',
  });

  // Interpolate name font size based on scroll position
  const nameFontSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [20, 16],
    extrapolate: 'clamp',
  });

  // Interpolate visibility based on scroll position
  const showHide = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: scrollY.interpolate({ inputRange: [0, 150], outputRange: [300, 200], extrapolate: 'clamp' }) }]}>
        <BookingSeniorDetails
          seniorDetails={seniorDetails}
          date={date}
          avatarSize={avatarSize}
          nameFontSize={nameFontSize}
          showHide={showHide}
        />
      </Animated.View>
      
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        // Animate based on scroll position
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer}></View>
        <BookingDetailsTabs
          additionalInfo={additionalInfo}
          ailmentCategories={ailmentCategories}
          ailments={ailments}
        />
        <BookingMapSection
          caregiverAddress={caregiverAddress}
          seniorAddress={seniorAddress}
        />
      </ScrollView>

      <BookingActionButtons data={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 200, // Matches initial height of the header
  },
  spacer: {
    height: 150, // Matches initial height of the header
  },
});

export default RequestDetailScreen;
