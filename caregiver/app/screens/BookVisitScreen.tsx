import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VisitDatePicker from '../components/VisitDatePicker';
import VisitTiming from '../components/VisitTiming';
import AdditionalDetails from '../components/AdditionalDetails';
import ActionButtons from '../components/ActionButtons';
import axios from 'axios';
import API_ENDPOINTS from '../../config/apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
  route: any;
};

const LOCATIONIQ_API_KEY = 'pk.865e92db6e699f2370da531cbb03e26a';

const BookVisitScreen: React.FC<Props> = ({ navigation, route }) => {
  const { caregiver } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState({ morning: true, afternoon: false, evening: false });
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any>({});

  useEffect(() => {
    const fetchAvailabilityAndBookings = async () => {
      try {
        if (!caregiver._id) {
          Alert.alert('Error', 'Caregiver ID is missing.');
          return;
        }
  
        // Fetch caregiver availability
        const availabilityResponse = await axios.get(API_ENDPOINTS.AVAILABILITY.GET_BY_CAREGIVER_ID(caregiver._id));
        const availability = availabilityResponse.data.availability;
  
        // Extract the available days
        const days = availability.map((item: any) => item.day);
        setAvailableDays(days);
  
        // Find and set the closest available date
        const closestAvailableDate = findClosestAvailableDate(days);
        setSelectedDate(closestAvailableDate);
  
        // Fetch existing bookings for the caregiver
        const bookingsResponse = await axios.get(API_ENDPOINTS.BOOKINGS.GET_ALL_SLOTS(caregiver._id, 'Accepted'));
        const bookings = bookingsResponse.data;
  
        // Handle the case where bookings might be empty
        if (bookings.length === 0) {
          
        } else {
          const slots = bookings.reduce((acc: any, booking: any) => {
            acc[booking.date] = {
              morning: booking.morning,
              afternoon: booking.afternoon,
              evening: booking.evening,
              isFullyBooked: booking.isFullyBooked,
            };
            return acc;
          }, {});
          setBookedSlots(slots);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          setBookedSlots({}); 
        } else {
          console.error('Error fetching data:', error);
          Alert.alert('Error', 'There was an error fetching data. Please try again.');
        }
      }
    };
  
    fetchAvailabilityAndBookings();
  }, [caregiver]);
  
  
  

  const findClosestAvailableDate = (availableDays: string[]) => {
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (availableDays.includes(dayName)) {
        return date.toISOString().split('T')[0];
      }
    }
    return today.toISOString().split('T')[0];
  };

  const fetchSeniorAddress = async (seniorId: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.GET_SENIOR_BY_ID(seniorId));
      return response.data;
    } catch (error) {
      console.error('Error fetching senior address:', error);
      throw new Error('Error fetching senior address');
    }
  };

  const getLatLngFromAddress = async (address: string) => {
    try {
      const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`);
      const location = response.data[0];
      return {
        lat: location.lat,
        lon: location.lon,
      };
    } catch (error) {
      console.error('Error fetching lat/lng from address:', error);
      throw new Error('Error fetching lat/lng from address');
    }
  };

  const handleBookVisit = async () => {
    if (!selectedDate || (!selectedSlots.morning && !selectedSlots.afternoon && !selectedSlots.evening)) {
      Alert.alert('Error', 'Please select a date and a time slot.');
      return;
    }

    try {
      const seniorId = await AsyncStorage.getItem('userId');
      if (!seniorId) {
        Alert.alert('Error', 'User ID is missing.');
        return;
      }

      const seniorData = await fetchSeniorAddress(seniorId);
      const { addressLine1, addressLine2, city, state, zipCode } = seniorData;
      const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${state} ${zipCode}`;

      const location = await getLatLngFromAddress(fullAddress);

      const bookingData = {
        seniorId: seniorId as string,
        caregiverId: caregiver._id,
        date: selectedDate,
        slots: selectedSlots,
        location: {
          latitude: location.lat,
          longitude: location.lon,
        },
        additionalInfo: additionalInfo,
        status: 'Pending',
      };

      await axios.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
      navigation.navigate('StatusScreen', {
        status: 'success',
        title: 'Booking successful!',
        message: 'Your caregiver will be visiting you at the time you selected.\nThank you!',
        duration: 5000,
        onContinue: () => navigation.navigate('Dashboard')
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'There was an error creating your booking. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={20}
      >
        <VisitDatePicker 
          onDateChange={setSelectedDate} 
          caregiverId={caregiver._id} 
          bookedSlots={bookedSlots} 
          availableDays={availableDays}
        />
        <VisitTiming 
          onSlotsChange={setSelectedSlots} 
          bookedSlots={bookedSlots[selectedDate] || {}}
        />
        <AdditionalDetails onInfoChange={setAdditionalInfo} />
      </KeyboardAwareScrollView>
      <ActionButtons onBookVisit={handleBookVisit} onGoBack={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

export default BookVisitScreen;
