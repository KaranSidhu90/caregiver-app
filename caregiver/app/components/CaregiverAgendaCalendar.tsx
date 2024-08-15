import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CalendarProvider, ExpandableCalendar, AgendaList } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CaregiverRequestCardStripped from './CaregiverRequestCardStripped';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { getDistanceMatrix } from '../helpers/distanceMatrixHelper';

type Booking = {
  _id: string;
  slots: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  status: string;
  additionalInfo: string;
  seniorId: string;
  caregiverId: string;
  date: string;
  location: {
    latitude: number;
    longitude: number;
  };
  seniorDetails: {
    careNeeds: string[];
    ailmentCategories: string[];
    ailments: string[];
    userType: string;
    _id: string;
    name: string;
    phoneNumber: string;
    gender: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    imageUrl: string;
  };
  distance?: string;
  caregiverAddress?: string;
  bookingStatus: string;
};

const CaregiverAgendaCalendar: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]); // State to hold booking data
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean } }>({}); // State to hold marked dates for the calendar
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [userAddress, setUserAddress] = useState<string | null>(null); // State to hold caregiver's address
  const [distancesFetched, setDistancesFetched] = useState<boolean>(false); // State to track if distances have been fetched

  useEffect(() => {
    fetchCaregiverDetails(); // Fetch caregiver details on component mount
  }, []);

  useEffect(() => {
    if (bookings.length > 0 && userAddress && !distancesFetched) {
      fetchDistances(); // Fetch distances once bookings and user address are available
    }
  }, [bookings, userAddress, distancesFetched]);

  // Fetches caregiver details from AsyncStorage and the API
  const fetchCaregiverDetails = async () => {
    const caregiverId = await AsyncStorage.getItem('userId');
    if (!caregiverId) {
      console.error('User ID is missing.');
      setLoading(false);
      return;
    }

    try {
      const caregiverResponse = await axios.get(API_ENDPOINTS.USERS.GET_CAREGIVER_BY_ID(caregiverId));
      const caregiverData = caregiverResponse.data;
      const { addressLine1, addressLine2, city, state, zipCode } = caregiverData;
      const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${state} ${zipCode}`;
      setUserAddress(fullAddress); // Set the user's full address

      fetchBookings(caregiverId); // Fetch bookings after setting the user address
    } catch (error) {
      console.error('Error fetching caregiver details:', error);
      setLoading(false);
    }
  };

  // Fetches bookings for the caregiver based on their ID
  const fetchBookings = async (caregiverId: string) => {
    try {
      const pendingUrl = API_ENDPOINTS.BOOKINGS.GET_BY_CAREGIVER_ID_DETAILS(caregiverId) + '?status=Pending';
      const acceptedUrl = API_ENDPOINTS.BOOKINGS.GET_BY_CAREGIVER_ID_DETAILS(caregiverId) + '?status=Accepted';

      const [pendingResponse, acceptedResponse] = await Promise.all([
        axios.get(pendingUrl),
        axios.get(acceptedUrl)
      ]);

      let allBookings = [...pendingResponse.data, ...acceptedResponse.data];

      if (allBookings.length === 0) {
        setBookings([]);
        setMarkedDates({});
        setLoading(false);
        return;
      }

      const markedDates = allBookings.reduce((acc, booking) => {
        const date = booking.date.split('T')[0];
        acc[date] = { marked: true };
        return acc;
      }, {} as { [key: string]: { marked: boolean } });

      setMarkedDates(markedDates); // Mark the dates on the calendar
      setBookings(allBookings); // Set the booking data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  // Fetches distances between the caregiver's address and each booking's location
  const fetchDistances = async () => {
    if (userAddress) {
      const destinations = bookings.map(
        booking => `${booking.seniorDetails.addressLine1} ${booking.seniorDetails.addressLine2}, ${booking.seniorDetails.city}, ${booking.seniorDetails.state} ${booking.seniorDetails.zipCode}`
      );

      try {
        const distanceData = await getDistanceMatrix([userAddress], destinations);

        const distanceValues = distanceData.rows[0].elements.map((element: any) => ({
          text: element.distance.text,
          value: element.distance.value
        }));

        const bookingsWithDistances = bookings.map((booking, index) => ({
          ...booking,
          distance: distanceValues[index].text,
          caregiverAddress: userAddress
        }));

        setBookings(bookingsWithDistances); // Set bookings with distances included
        setDistancesFetched(true); // Mark distances as fetched
      } catch (error) {
        console.error('Error fetching distances:', error);
      }
    }
  };

  // Renders individual booking items
  const renderItem = ({ item }: { item: Booking }) => {
    console.log('Data passed to CaregiverRequestCardStripped:', item);

    if (!item.seniorDetails || !Array.isArray(item.seniorDetails.careNeeds)) {
      console.warn('Invalid seniorDetails or careNeeds missing');
      return null;
    }

    return (
      <CaregiverRequestCardStripped
        key={item._id}
        data={item}
      />
    );
  };

  // Groups bookings by date for display in the agenda
  const getSections = () => {
    if (bookings.length === 0) {
      return [
        {
          title: '',
          data: [],
        },
      ];
    }

    const groupedBookings = bookings.reduce((acc, booking) => {
      const date = booking.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {} as { [key: string]: Booking[] });

    return Object.keys(markedDates).map(date => ({
      title: date,
      data: groupedBookings[date] || [null],
    }));
  };

  return (
    <CalendarProvider
      date={new Date().toISOString().split('T')[0]}
      showTodayButton
      theme={{ todayButtonTextColor: '#295259' }}
    >
      <ExpandableCalendar
        firstDay={1}
        animateScroll
        markedDates={markedDates} // Pass marked dates to the calendar
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#4A4A4A',
          selectedDayBackgroundColor: '#295259',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#295259',
          dayTextColor: '#4A4A4A',
          textDisabledColor: '#E0E0E0',
          monthTextColor: '#295259',
          arrowColor: '#295259',
          textDayFontFamily: 'Poppins-Regular',
          textMonthFontFamily: 'Poppins-Semibold',
          textDayHeaderFontFamily: 'Poppins-Semibold',
        }}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text> 
        </View>
      ) : (
        <View style={styles.bookingsContainer}>
          <AgendaList
            sections={getSections()} // Pass grouped bookings to the agenda list
            renderItem={renderItem} // Render each booking item
            scrollToNextEvent
            sectionStyle={styles.section}
            ListEmptyComponent={<Text style={styles.noBookingsText}>No Bookings Available</Text>}
          />
        </View>
      )}
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#f0f0f0',
    color: '#4A4A4A',
    textTransform: 'capitalize',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingsContainer: {
    flex: 1,
    backgroundColor: '#eaeaea', 
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  noBookingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noBookingsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default CaregiverAgendaCalendar;
