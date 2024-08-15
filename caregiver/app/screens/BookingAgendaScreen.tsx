import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CalendarProvider, ExpandableCalendar, AgendaList } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingCard from '../components/BookingCard';
import API_ENDPOINTS from '../../config/apiEndpoints';

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

const BookingAgendaScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [caregivers, setCaregivers] = useState<{ [key: string]: Caregiver }>({});
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const seniorId = await AsyncStorage.getItem('userId');
        if (!seniorId) {
          throw new Error('User ID is missing.');
        }

        const pendingUrl = API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Pending';
        const acceptedUrl = API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Accepted';

        
        

        let allBookings: Booking[] = [];

        // Fetch Pending Bookings
        try {
          const pendingResponse = await axios.get(pendingUrl);
          allBookings = [...allBookings, ...pendingResponse.data];
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            console.warn('No pending bookings found.');
          } else {
            throw error; // Re-throw unexpected errors
          }
        }

        // Fetch Accepted Bookings
        try {
          const acceptedResponse = await axios.get(acceptedUrl);
          allBookings = [...allBookings, ...acceptedResponse.data];
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
             
          } else {
            throw error; // Re-throw unexpected errors
          }
        }

        if (allBookings.length === 0) {
          
          setBookings([]);
          setMarkedDates({});
          setLoading(false);
          return;
        }

        setBookings(allBookings);

        const caregiverIds = Array.from(new Set(allBookings.map((booking: Booking) => booking.caregiverId)));

        const caregiverMap = await caregiverIds.reduce(async (accPromise, id) => {
          const acc = await accPromise;
          try {
            const url = API_ENDPOINTS.USERS.GET_CAREGIVER_BY_ID(id);
            
            const { data } = await axios.get(url);
            acc[data._id] = data;
          } catch (error) {
            console.warn('Failed to fetch caregiver data:', error);
          }
          return acc;
        }, Promise.resolve({} as { [key: string]: Caregiver }));

        setCaregivers(caregiverMap);

        // Mark Dates
        const markedDates = allBookings.reduce((acc, booking) => {
          const date = booking.date.split('T')[0];
          acc[date] = { marked: true };
          return acc;
        }, {} as { [key: string]: { marked: boolean } });

        setMarkedDates(markedDates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookingChange = (bookingId: string) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
  };

  const renderItem = ({ item }: { item: Booking }) => {
    return item ? (
      <BookingCard key={item._id} booking={item} caregiver={caregivers[item.caregiverId]} onBookingChange={handleBookingChange} />
    ) : (
      <View style={styles.noBookingContainer}>
        <Text style={styles.noBookingsText}>No bookings for the day</Text>
      </View>
    );
  };

  const getSections = () => {
    if (bookings.length === 0) {
      return [
        {
          title: '',
          data: [],
        },
      ];
    }

    const groupedBookings: GroupedBookings = bookings.reduce((acc: GroupedBookings, booking: Booking) => {
      const date = booking.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {});

    const allDates = Object.keys(markedDates);

    return allDates.map((date) => ({
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
        markedDates={markedDates}
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
        <AgendaList
          sections={getSections()}
          renderItem={renderItem}
          scrollToNextEvent
          sectionStyle={styles.section}
          ListEmptyComponent={<Text style={styles.noBookingsText}>No Bookings Available</Text>}
        />
      )}
    </CalendarProvider>
  );
};

export default BookingAgendaScreen;

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
