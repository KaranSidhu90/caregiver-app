import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

type Props = {
  onDateChange: (date: string) => void;
  caregiverId: string;
  bookedSlots: any;
  availableDays: string[];
};

const VisitDatePicker: React.FC<Props> = ({ onDateChange, caregiverId, bookedSlots, availableDays }) => {
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const closestAvailableDate = findClosestAvailableDate(availableDays);
    setSelectedDate(closestAvailableDate);
    onDateChange(closestAvailableDate);
    
  }, [availableDays, onDateChange]);

  useEffect(() => {
    
    
    
  }, [availableDays, bookedSlots, selectedDate]);

  const findClosestAvailableDate = (availableDays: string[]) => {
    const today = moment();
    for (let i = 0; i < 90; i++) {
      const date = moment().add(i, 'days');
      const dayName = date.format('dddd');
      if (availableDays.includes(dayName)) {
        return date.format('YYYY-MM-DD');
      }
    }
    return today.format('YYYY-MM-DD');
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

    for (let i = 0; i < 90; i++) {
      const date = moment().add(i, 'days').format('YYYY-MM-DD');
      const booking = bookedSlots[date];

      if (!isDayAvailable(date)) {
        markedDates[date] = {
          disabled: true,
          disableTouchEvent: true,
        };
      } else if (booking) {
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
