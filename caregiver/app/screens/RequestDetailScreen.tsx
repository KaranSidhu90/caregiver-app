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
  const { request } = route.params;
  const { seniorDetails, date, additionalInfo, caregiverAddress } = request;
  const { ailmentCategories, ailments, careNeeds } = seniorDetails || {};
  console.log('Request Data:', request);

  const seniorAddress = `${seniorDetails.addressLine1}, ${seniorDetails.addressLine2}, ${seniorDetails.city}, ${seniorDetails.state} ${seniorDetails.zipCode}`;

  const scrollY = useRef(new Animated.Value(0)).current;

  const avatarSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [116, 58],
    extrapolate: 'clamp',
  });

  const nameFontSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [20, 16],
    extrapolate: 'clamp',
  });

  const showHide = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleConfirmRequest = () => {
    console.log(`Confirmed request with ID: ${request._id}`);
    navigation.goBack();
  };

  const handleDeclineRequest = () => {
    console.log(`Declined request with ID: ${request._id}`);
    navigation.goBack();
  };

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
      <BookingActionButtons
      data={route}
        />
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
    paddingTop: 200,  // Adjust this to match the initial height of the header
  },
  spacer: {
    height: 150,  // Adjust this to match the initial height of the header
  },
});

export default RequestDetailScreen;
