import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import API_ENDPOINTS from '../../config/apiEndpoints';

const VisitDatePicker: React.FC<{ onDateChange: (date: string) => void, caregiverId: string }> = ({ onDateChange, caregiverId }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any>({});

  useEffect(() => {
    const fetchAvailabilityAndBookings = async () => {
      try {
        if (!caregiverId) {
          Alert.alert('Error', 'Caregiver ID is missing.');
          return;
        }

        const availabilityResponse = await axios.get(API_ENDPOINTS.AVAILABILITY.GET_BY_CAREGIVER_ID(caregiverId));
        const availability = availabilityResponse.data.availability;

        const days = availability.map((item: any) => item.day);
        setAvailableDays(days);

        const closestAvailableDate = findClosestAvailableDate(days);
        setSelectedDate(closestAvailableDate);
        onDateChange(closestAvailableDate);

        // Fetch fully booked dates
        const bookingsResponse = await axios.get(API_ENDPOINTS.BOOKINGS.GET_ALL_SLOTS(caregiverId, 'Accepted'));
        const bookings = bookingsResponse.data;
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
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'There was an error fetching data. Please try again.');
      }
    };

    fetchAvailabilityAndBookings();
  }, [caregiverId, onDateChange]);

  const findClosestAvailableDate = (availableDays: string[]) => {
    const today = moment();
    for (let i = 0; i < 90; i++) { // Limit to 3 months (approximately 90 days)
      const date = moment().add(i, 'days');
      const dayName = date.format('dddd');
      if (availableDays.includes(dayName)) {
        return date.format('YYYY-MM-DD');
      }
    }
    return today.format('YYYY-MM-DD'); // Fallback to today if no available days are found
  };

  const handleDateSelected = (date: string) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const isDayAvailable = (day: string) => {
    const dayName = moment(day).format('dddd');
    return availableDays.includes(dayName);
  };

  const getMarkedDates = () => {
    const markedDates: any = {};

    for (let i = 0; i < 90; i++) { // Limit to 3 months (approximately 90 days)
      const date = moment().add(i, 'days').format('YYYY-MM-DD');
      const booking = bookedSlots[date];

      if (!isDayAvailable(date)) {
        // Disable dates that are not available
        markedDates[date] = {
          disabled: true,
          disableTouchEvent: true,
        };
      } else if (booking) {
        // Add dots based on booked slots
        const dots = [];
        if (booking.morning) dots.push({ key: 'morning', color: 'red', selectedDotColor: 'orange' });
        if (booking.afternoon) dots.push({ key: 'afternoon', color: 'red', selectedDotColor: 'orange' });
        if (booking.evening) dots.push({ key: 'evening', color: 'red', selectedDotColor: 'orange' });

        markedDates[date] = {
          dots,
          customStyles: {
            container: {
              backgroundColor: selectedDate === date ? '#295259' : undefined,
            },
            text: {
              color: booking.isFullyBooked ? 'red' : selectedDate === date ? 'white' : 'black',
            },
          },
        };
        if (booking.isFullyBooked) {
          markedDates[date].disableTouchEvent = true;
        }
      }
    }

    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#295259',
      selectedTextColor: 'white',
      customStyles: {
        container: {
          backgroundColor: '#295259',
        },
        text: {
          color: 'white',
        },
      },
    };

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Visit Date</Text>
      <Calendar
        current={selectedDate} // Set the initial date to the closest available date
        minDate={moment().format('YYYY-MM-DD')} // Set the minimum date to today
        maxDate={moment().add(3, 'months').format('YYYY-MM-DD')} // Set the maximum date to 3 months from today
        onDayPress={(day: { dateString: string }) => handleDateSelected(day.dateString)}
        markedDates={getMarkedDates()}
        markingType={'multi-dot'}
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
        enableSwipeMonths={true}
      />
      <Text style={styles.infoText}>Bookings can only be made in a 3 month period</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

export default VisitDatePicker;
