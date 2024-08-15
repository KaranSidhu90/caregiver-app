import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import BookingCard from './BookingCard';
import { format, parseISO, isValid, addDays } from 'date-fns';

type Props = {
  bookings: any[];
  caregivers: { [key: string]: any };
};

const BookingCalendarView: React.FC<Props> = ({ bookings, caregivers }) => {
  // State to track the selected date
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // State to store bookings filtered by the selected date
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);

  // Handles the date selection and filters bookings for that date
  const handleDateSelected = (date: string) => {
    setSelectedDate(format(parseISO(date), 'EEEE, do MMM, yyyy'));
    const formattedActualDate = format(addDays(parseISO(date), -1), 'yyyy-MM-dd');
    setFilteredBookings(
      bookings.filter((booking) => format(parseISO(booking.date), 'yyyy-MM-dd') === formattedActualDate)
    );
  };

  // Marks dates on the calendar that have bookings
  const getMarkedDates = () => {
    const markedDates: any = {};
    bookings.forEach((booking) => {
      const parsedDate = addDays(parseISO(booking.date), 1);
      if (isValid(parsedDate)) {
        const date = format(parsedDate, 'yyyy-MM-dd');
        markedDates[date] = { marked: true, selectedColor: '#295259' };
      }
    });
    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#295259',
        selectedTextColor: 'white',
      };
    }
    return markedDates;
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate || undefined}
          minDate={'2024-01-01'}
          maxDate={'2025-12-31'}
          onDayPress={(day: DateData) => handleDateSelected(day.dateString)} // Trigger date selection
          markedDates={getMarkedDates()} // Mark dates with bookings
          markingType={'simple'}
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
      </View>
      {selectedDate && (
        <View style={styles.bookingsContainer}>
          <Text style={styles.selectedDate}>{selectedDate}</Text>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            {/* Render booking cards for the selected date */}
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking}  caregiver={caregivers[booking.caregiverId]} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  bookingsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
    color: '#295259',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, 
  },
});

export default BookingCalendarView;
