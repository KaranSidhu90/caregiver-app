import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const seniorId = await AsyncStorage.getItem('userId');
        if (!seniorId) {
          throw new Error('User ID is missing.');
        }

        const pendingUrl = API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Pending';
        const acceptedUrl = API_ENDPOINTS.BOOKINGS.GET_BY_SENIOR_ID(seniorId) + '?status=Accepted';
        console.log('Hitting URL for pending bookings:', pendingUrl);
        console.log('Hitting URL for accepted bookings:', acceptedUrl);

        const [pendingResponse, acceptedResponse] = await Promise.all([
          axios.get(pendingUrl),
          axios.get(acceptedUrl),
        ]);

        const allBookings = [...pendingResponse.data, ...acceptedResponse.data];
        setBookings(allBookings);

        const caregiverIds = new Set(allBookings.map((booking: Booking) => booking.caregiverId));

        const caregiverData = await Promise.all(
          Array.from(caregiverIds).map((id) => {
            const url = API_ENDPOINTS.USERS.GET_CAREGIVER_BY_ID(id);
            console.log('Hitting URL for caregiver data:', url);
            return axios.get(url);
          })
        );

        const caregiverMap = caregiverData.reduce((acc, { data }) => {
          acc[data._id] = data;
          return acc;
        }, {} as { [key: string]: Caregiver });

        setCaregivers(caregiverMap);

        const markedDates = allBookings.reduce((acc, booking) => {
          const date = booking.date.split('T')[0]; // Extract date part only
          acc[date] = { marked: true };
          return acc;
        }, {} as { [key: string]: { marked: boolean } });

        setMarkedDates(markedDates);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleBookingChange = (bookingId: string) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
  };

  const renderItem = ({ item }: { item: Booking }) => {
    return <BookingCard key={item._id} booking={item} caregiver={caregivers[item.caregiverId]} onBookingChange={handleBookingChange} />;
  };

  const getSections = () => {
    const groupedBookings: GroupedBookings = bookings.reduce((acc: GroupedBookings, booking: Booking) => {
      const date = booking.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {});

    return Object.keys(groupedBookings).map((date) => ({
      title: date,
      data: groupedBookings[date],
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
      <AgendaList
        sections={getSections()}
        renderItem={renderItem}
        scrollToNextEvent
        sectionStyle={styles.section}
      />
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
});
