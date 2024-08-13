import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { toast } from '@backpackapp-io/react-native-toast'; 
import { CaregiverStackParamList } from '../../@types/types';

type Props = {
  data: any; 
};

const BookingActionButtons: React.FC<Props> = ({ data }) => {
  const navigation = useNavigation<NavigationProp<CaregiverStackParamList>>();

  const handleAcceptBooking = async () => {
    try {
      const bookingId = data?.params?.request?._id;
      const url = API_ENDPOINTS.BOOKINGS.CHANGE_STATUS(bookingId, 'Accepted');
      await axios.patch(url);

      navigation.navigate('CaregiverDashboard');
      toast.success('Booking Accepted successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error accepting booking:', error.response);
      } else {
        console.error('Unexpected error accepting booking:', error);
      }
      toast.error('Error accepting booking');
    }
  };

  const handleCancelBooking = async () => {
    try {
      const bookingId = data?.params?.request?._id;
      const url = API_ENDPOINTS.BOOKINGS.CHANGE_STATUS(bookingId, 'Cancelled');
      await axios.patch(url);

      navigation.navigate('CaregiverDashboard');
      toast.success('Booking cancelled successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error cancelling booking:', error.response);
      } else {
        console.error('Unexpected error cancelling booking:', error);
      }
      toast.error('Error cancelling booking');
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleAcceptBooking}>
        <Text style={styles.buttonText}>ACCEPT REQUEST</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={handleCancelBooking}>
        <Text style={styles.buttonText}>DECLINE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 35,
    marginVertical: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#295259',
  },
  declineButton: {
    backgroundColor: '#C2A27C',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default BookingActionButtons;
