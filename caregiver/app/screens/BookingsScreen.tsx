import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ViewPager from '@react-native-community/viewpager';
import BookingTabs from '../components/BookingTabs';
import BookingCard from '../components/BookingCard';
import BookingCalendarView from '../components/BookingCalendarView';
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
  const [activeTab, setActiveTab] = useState(1); // Default to Accepted tab
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [caregivers, setCaregivers] = useState<{ [key: string]: Caregiver }>({});
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const viewPagerRef = useRef<ViewPager>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const seniorId = await AsyncStorage.getItem('userId');
        if (!seniorId) {
          throw new Error('User ID is missing.');
        }

        const [pendingResponse, acceptedResponse, cancelledResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Pending'),
          axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Accepted'),
          axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Cancelled'),
        ]);

        setPendingBookings(pendingResponse.data);
        setAcceptedBookings(acceptedResponse.data);
        setCancelledBookings(cancelledResponse.data);

        const caregiverIds = new Set([
          ...pendingResponse.data.map((booking: Booking) => booking.caregiverId),
          ...acceptedResponse.data.map((booking: Booking) => booking.caregiverId),
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
        console.error('Error fetching bookings:', error);
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

  const renderBookings = (bookings: Booking[]) => {
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
          <BookingCard key={booking._id} booking={booking} caregiver={caregivers[booking.caregiverId]} />
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

  const renderView = (bookings: Booking[]) => {
    if (viewMode === 'list') {
      return <ScrollView style={styles.fullWidth} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>{renderBookings(bookings)}</ScrollView>;
    } else {
      return <BookingCalendarView bookings={bookings} caregivers={caregivers} />;
    }
  };

  return (
    <View style={styles.container}>
      <BookingTabs activeTab={activeTab} onChangeTab={handleChangeTab} />
      <ViewPager
        style={styles.viewPager}
        initialPage={1}
        ref={viewPagerRef}
        onPageSelected={(e) => handleChangeTab(e.nativeEvent.position)}
      >
        <View key="1" style={styles.page}>
          {renderView(pendingBookings)}
        </View>
        <View key="2" style={styles.page}>
          {renderView(acceptedBookings)}
        </View>
        <View key="3" style={styles.page}>
          {renderView(cancelledBookings)}
        </View>
      </ViewPager>
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.switchButton, viewMode === 'list' && styles.activeSwitch]}>
          <Text style={[styles.switchText, viewMode === 'list' && styles.activeSwitchText]}>List View</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('calendar')} style={[styles.switchButton, viewMode === 'calendar' && styles.activeSwitch]}>
          <Text style={[styles.switchText, viewMode === 'calendar' && styles.activeSwitchText]}>Calendar View</Text>
        </TouchableOpacity>
      </View>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 0,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 15, // Increased height of buttons
    backgroundColor: '#e0e0e0',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
  },
  activeSwitch: {
    backgroundColor: '#295259',
  },
  activeSwitchText: {
    color: '#ffffff',
  },
});

export default Bookings;
