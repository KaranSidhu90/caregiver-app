import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

const VisitDatePicker: React.FC<{ onDateChange: (date: string) => void }> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    setTimeout(() => {
      onDateChange(selectedDate.format('YYYY-MM-DD'));
    }, 500);
  }, []);

  const handleDateSelected = (date: moment.Moment) => {
    setSelectedDate(date);
    onDateChange(date.format('YYYY-MM-DD'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Visit Date</Text>
      <CalendarStrip
        style={styles.calendar}
        selectedDate={selectedDate}
        onDateSelected={handleDateSelected}
        calendarAnimation={{ type: 'sequence', duration: 50 }}
        daySelectionAnimation={{
          type: 'background',
          duration: 200,
          highlightColor: '#295259',
        }}
        calendarHeaderStyle={{ color: '#295259', fontSize: 18, fontFamily: 'Poppins-Semibold'}}
        highlightDateNameStyle={{ color: 'white', fontSize: 15, fontFamily: 'Poppins-Semibold' }}
        highlightDateNumberStyle={{ color: 'white', fontSize: 15, fontFamily: 'Poppins-Semibold' }}
        dateNumberStyle={{ color: '#4A4A4A', fontSize: 15, fontFamily: 'Poppins-Semibold' }}
        dateNameStyle={{ color: '#4A4A4A', fontSize: 15, fontFamily: 'Poppins-Semibold' }}
        highlightDateContainerStyle={styles.selectedDayContainer}
        disabledDateNameStyle={{ color: '#E0E0E0', fontSize: 15 }}
        iconLeftStyle={{ tintColor: '#295259', height: 25, width: 25,  }}
        iconRightStyle={{ tintColor: '#295259', height: 25, width: 25,  }}
        dayComponentHeight={60}
        disabledDateNumberStyle={{ color: '#E0E0E0', fontSize: 15 }}
        shouldAllowFontScaling={true}
        scrollerPaging
        datesWhitelist={[
          {
            start: moment(),
            end: moment().add(5, 'months'), 
          },
        ]}
      />
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
  calendar: {
    height: 150,
    paddingTop: 10,
    paddingBottom: 10,
  },
  selectedDayContainer: {
    backgroundColor: '#295259',
    borderRadius: 20,
  },
});

export default VisitDatePicker;
