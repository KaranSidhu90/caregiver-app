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
  const bookingId = data?.params?.request?._id; // Extract booking ID from data
  const status = data?.params?.request?.status; // Extract status from data

  // Handles changing the booking status
  const handleStatusChange = async (newStatus: string) => {
    try {
      const url = API_ENDPOINTS.BOOKINGS.CHANGE_STATUS(bookingId, newStatus); // Construct API URL
      await axios.patch(url); // Send PATCH request to update status

      navigation.navigate('CaregiverDashboard'); // Navigate back to dashboard
      toast.success(`Booking ${newStatus} successfully`); // Show success message
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error changing booking status to ${newStatus}:`, error.response); // Log Axios-specific error
      } else {
        console.error(`Unexpected error changing booking status to ${newStatus}:`, error); // Log general error
      }
      toast.error(`Error changing booking status to ${newStatus}`); // Show error message
    }
  };

  // Renders action buttons based on the current booking status
  const renderButtons = () => {
    switch (status) {
      case 'Accepted':
        return (
          <>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => handleStatusChange('Pending')}
            >
              <Text style={styles.buttonText}>MOVE TO PENDING</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={() => handleStatusChange('Cancelled')}
            >
              <Text style={styles.buttonText}>DECLINE</Text>
            </TouchableOpacity>
          </>
        );
      case 'Pending':
        return (
          <>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => handleStatusChange('Accepted')}
            >
              <Text style={styles.buttonText}>ACCEPT REQUEST</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={() => handleStatusChange('Cancelled')}
            >
              <Text style={styles.buttonText}>DECLINE</Text>
            </TouchableOpacity>
          </>
        );
      case 'Completed':
        return (
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            // Uncomment below to navigate to the review screen
            // onPress={() => navigation.navigate('ReviewScreen', { bookingId })}
          >
            <Text style={styles.buttonText}>SHOW REVIEW</Text>
          </TouchableOpacity>
        );
      case 'Cancelled':
        return (
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => handleStatusChange('Pending')}
          >
            <Text style={styles.buttonText}>MOVE BACK TO PENDING</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {renderButtons()} 
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
