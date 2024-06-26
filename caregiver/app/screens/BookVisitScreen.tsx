import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import VisitDatePicker from '../components/VisitDatePicker';
import VisitTiming from '../components/VisitTiming';
import AdditionalDetails from '../components/AdditionalDetails';
import ActionButtons from '../components/ActionButtons';

type Props = {
  navigation: any;
};

const BookVisitScreen: React.FC<Props> = ({ navigation }) => {
  const handleBookVisit = () => {
    navigation.navigate('StatusScreen', {
      status: 'success',
      title: 'Booking successful!',
      message: 'Nicole will be visiting you at the time you selected.\nThank you!',
      duration: 5000,
      onContinue: () => navigation.navigate('Dashboard')
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <VisitDatePicker onDateChange={(date) => console.log(date)} />
        <VisitTiming />
        <AdditionalDetails />
      </ScrollView>
      <ActionButtons onBookVisit={handleBookVisit} onGoBack={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 80, 
  },
});

export default BookVisitScreen;
