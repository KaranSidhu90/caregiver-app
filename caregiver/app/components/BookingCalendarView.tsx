import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import BookingCard from './BookingCard';

type Props = {
  bookings: any[];
  caregivers: { [key: string]: any };
};

const BookingCalendarView: React.FC<Props> = ({ bookings, caregivers }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    if (bookings.length > 0) {
      setSelectedDate(moment(bookings[0].date).format('YYYY-MM-DD'));
    }
  }, [bookings]);

  const handleDateSelected = (date: string) => {
    if (selectedDate === date) {
      setShowCalendar(!showCalendar);
    } else {
      setSelectedDate(date);
      setShowCalendar(false);
    }
  };

  const isDayBooked = (day: string) => {
    return bookings.some(booking => moment(booking.date).format('YYYY-MM-DD') === day);
  };

  const getMarkedDates = () => {
    const markedDates: any = {};

    bookings.forEach(booking => {
      const date = moment(booking.date).format('YYYY-MM-DD');
      const dots = [];
      if (booking.slots.morning) dots.push({ key: 'morning', color: 'red', selectedDotColor: 'orange' });
      if (booking.slots.afternoon) dots.push({ key: 'afternoon', color: 'red', selectedDotColor: 'orange' });
      if (booking.slots.evening) dots.push({ key: 'evening', color: 'red', selectedDotColor: 'orange' });

      markedDates[date] = {
        dots,
        customStyles: {
          container: {
            backgroundColor: selectedDate === date ? '#295259' : undefined,
          },
          text: {
            color: selectedDate === date ? 'white' : 'black',
          },
        },
      };
    });

    if (selectedDate) {
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
    }

    return markedDates;
  };

  const renderBookingsForSelectedDate = () => {
    const bookingsForDate = bookings.filter(
      booking => moment(booking.date).format('YYYY-MM-DD') === selectedDate
    );

    return bookingsForDate.map(booking => (
      <BookingCard key={booking._id} booking={booking} caregiver={caregivers[booking.caregiverId]} />
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
        <Text style={styles.toggleButton}>
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </Text>
      </TouchableOpacity>
      {showCalendar && (
        <Calendar
          current={selectedDate}
          minDate={moment().format('YYYY-MM-DD')}
          maxDate={moment().add(3, 'months').format('YYYY-MM-DD')}
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
      )}
      {selectedDate && !showCalendar && (
        <View style={styles.bookingsContainer}>
          <Text style={styles.selectedDate}>{moment(selectedDate).format('MMMM Do, YYYY')}</Text>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderBookingsForSelectedDate()}
          </ScrollView>
        </View>
      )}
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
  toggleButton: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    color: '#295259',
    textAlign: 'center',
    marginVertical: 10,
  },
  bookingsContainer: {
    marginTop: 20,
  },
  selectedDate: {
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
    color: '#295259',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollView: {
    height: 300, // Adjust height as needed
  },
});

export default BookingCalendarView;
