import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ViewPager from '@react-native-community/viewpager';
import BookingTabs from '../components/BookingTabs';
import BookingCard from '../components/BookingCard';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { format, addDays, parseISO } from 'date-fns';

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
};

type Caregiver = {
  _id: string;
  name: string;
  imageUrl: string;
};

type GroupedBookings = {
  [date: string]: Booking[];
};

const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // Default to Completed tab
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [caregivers, setCaregivers] = useState<{ [key: string]: Caregiver }>({});
  const viewPagerRef = useRef<ViewPager>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const seniorId = await AsyncStorage.getItem('userId');
        if (!seniorId) {
          throw new Error('User ID is missing.');
        }

        const [completedResponse, cancelledResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Completed'),
          axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Cancelled'),
        ]);

        setCompletedBookings(completedResponse.data);
        setCancelledBookings(cancelledResponse.data);

        const caregiverIds = new Set([
          ...completedResponse.data.map((booking: Booking) => booking.caregiverId),
          ...cancelledResponse.data.map((booking: Booking) => booking.caregiverId),
        ]);

        const caregiverData = await Promise.all(
          Array.from(caregiverIds).map((id) => axios.get(API_ENDPOINTS.USERS.GET_CAREGIVER_BY_ID(id)))
        );

        const caregiverMap = caregiverData.reduce((acc, { data }) => {
          acc[data._id] = data;
          return acc;
        }, {} as { [key: string]: Caregiver });

        setCaregivers(caregiverMap);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          setCompletedBookings([]);  // No completed bookings
          setCancelledBookings([]);  // No cancelled bookings
          setLoading(false);
        } else {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    fetchBookings();
  }, []);

  const handleChangeTab = (index: number) => {
    setActiveTab(index);
    if (viewPagerRef.current) {
      viewPagerRef.current.setPage(index);
    }
  };

  const handleBookingChange = (bookingId: string) => {
    setCompletedBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    setCancelledBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
  };

  const renderBookings = (bookings: Booking[], noBookingsText: string) => {
    if (bookings.length === 0) {
      return (
        <View style={styles.noBookingsContainer}>
          <Text style={styles.noBookingsText}>{noBookingsText}</Text>
        </View>
      );
    }

    const groupedBookings: GroupedBookings = bookings.reduce((acc: GroupedBookings, booking: Booking) => {
      try {
        const date = format(addDays(parseISO(booking.date), 1), 'EEEE, do MMM, yyyy');
        if (!acc[date]) acc[date] = [];
        acc[date].push({ ...booking });
      } catch (error) {
        console.error('Error parsing date for booking:', booking.date, error);
      }
      return acc;
    }, {});

    return Object.keys(groupedBookings).map((date) => (
      <View key={date} style={styles.dateContainer}>
        <Text style={styles.dateHeader}>{date}</Text>
        {groupedBookings[date].map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            caregiver={caregivers[booking.caregiverId]}
            onBookingChange={handleBookingChange}
          />
        ))}
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookingTabs activeTab={activeTab} onChangeTab={handleChangeTab} tabs={['Completed', 'Cancelled']} />
      <ViewPager
        style={styles.viewPager}
        initialPage={0}
        ref={viewPagerRef}
        onPageSelected={(e) => handleChangeTab(e.nativeEvent.position)}
      >
        <View key="1" style={styles.page}>
          <ScrollView style={styles.fullWidth} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            {renderBookings(completedBookings, "No Completed Bookings")}
          </ScrollView>
        </View>
        <View key="2" style={styles.page}>
          <ScrollView style={styles.fullWidth} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            {renderBookings(cancelledBookings, "No Cancelled Bookings")}
          </ScrollView>
        </View>
      </ViewPager>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  viewPager: {
    flex: 1,
  },
  page: {
    flex: 1,
    padding: 20,
  },
  fullWidth: {
    width: '100%',
  },
  dateContainer: {
    width: '100%',
    marginBottom: 10,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingBottom: 80, // Ensures the last item is not hidden
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default Bookings;
