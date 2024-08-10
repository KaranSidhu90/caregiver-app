import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { toast } from '@backpackapp-io/react-native-toast';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { getAvatarUrl } from '../helpers/common';
import { getDistanceMatrix } from '../helpers/distanceMatrixHelper';
import { format } from 'date-fns';

type Props = {
  booking: any;
  caregiver: any;
  onClose: () => void;
  onBookingChange: (bookingId: string) => void;
};

const BookingDetails: React.FC<Props> = ({ booking, caregiver, onClose, onBookingChange }) => {
  const [distance, setDistance] = useState<string | null>(null);
  const avatarUrl = getAvatarUrl(caregiver ? caregiver.name : 'Unknown', caregiver?.imageUrl);

  useEffect(() => {
    const fetchDistance = async () => {
      try {
        const seniorAddress = await fetchSeniorAddress(booking.seniorId);
        const caregiverAddress = `${caregiver.addressLine1} ${caregiver.addressLine2}, ${caregiver.city}, ${caregiver.state} ${caregiver.zipCode}`;
        const distanceData = await getDistanceMatrix([seniorAddress], [caregiverAddress]);
        const distanceText = distanceData.rows[0].elements[0].distance.text;
        setDistance(distanceText);
      } catch (error) {
        console.error('Error fetching distance:', error);
      }
    };

    fetchDistance();
  }, [booking.seniorId, caregiver]);

  const fetchSeniorAddress = async (seniorId: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.GET_SENIOR_BY_ID(seniorId));
      const { addressLine1, addressLine2, city, state, zipCode } = response.data;
      return `${addressLine1} ${addressLine2}, ${city}, ${state} ${zipCode}`;
    } catch (error) {
      console.error('Error fetching senior address:', error);
      throw new Error('Error fetching senior address');
    }
  };

  const handleCompleteBooking = async () => {
    try {
      const url = API_ENDPOINTS.BOOKINGS.CHANGE_STATUS(booking._id, 'Completed');
      await axios.patch(url);
      onBookingChange(booking._id);
      onClose();
      toast.success('Booking completed successfully');
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Error completing booking');
    }
  };

  const handleCancelBooking = async () => {
    try {
      const url = API_ENDPOINTS.BOOKINGS.CHANGE_STATUS(booking._id, 'Cancelled');
      await axios.patch(url);
      onBookingChange(booking._id);
      onClose();
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    }
  };

  const formatBookingDate = (date: string) => {
    return format(new Date(date), 'EEEE, do MMMM, yyyy');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.statusContainer}>
        <View style={[styles.statusChip, booking.status === 'Accepted' ? styles.acceptedChip : booking.status === 'Completed' ? styles.completedChip : booking.status === 'Cancelled' ? styles.cancelledChip : styles.pendingChip]}>
          <Icon name={booking.status === 'Accepted' ? 'check-circle' : booking.status === 'Completed' ? 'done' : booking.status === 'Cancelled' ? 'cancel' : 'hourglass-empty'} size={20} color="#fff" />
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>
      <Image source={{ uri: avatarUrl }} style={styles.caregiverImage} />
      <Text style={styles.caregiverName}>{caregiver ? caregiver.name : 'Unknown Caregiver'}</Text>
      <Text style={styles.date}>{formatBookingDate(booking.date)}</Text>
      <Text style={styles.slot}>{getSlotText(booking.slots)}</Text>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceLabel}>Distance:</Text>
        {distance ? (
          <Text style={styles.distance}>{distance}</Text>
        ) : (
          <ActivityIndicator size="small" color="#0000ff" style={styles.loader} />
        )}
      </View>
      <Text style={styles.additionalInfoHeader}>Additional Details</Text>
      <Text style={styles.additionalInfo}>{booking.additionalInfo || 'No additional details provided.'}</Text>
      <View style={styles.actions}>
        {booking.status === 'Accepted' && (
          <>
            <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={handleCompleteBooking}>
              <Text style={styles.buttonText}>Complete Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelBooking}>
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </>
        )}
        {booking.status === 'Pending' && (
          <>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelBooking}>
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </>
        )}
        {booking.status === 'Completed' && (
          <>
            <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Booking Completed</Text>
            </TouchableOpacity>
          </>
        )}
        {booking.status === 'Cancelled' && (
          <>
            <TouchableOpacity style={[styles.button, styles.cancelledButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Booking Cancelled</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const getSlotText = (slots: { morning: boolean; afternoon: boolean; evening: boolean }) => {
  if (slots.morning) return 'Morning (8AM - 12PM)';
  if (slots.afternoon) return 'Afternoon (1PM - 5PM)';
  if (slots.evening) return 'Evening (6PM - 10PM)';
  return '';
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  acceptedChip: {
    backgroundColor: '#9FD4A3',
  },
  completedChip: {
    backgroundColor: '#295259',
  },
  cancelledChip: {
    backgroundColor: '#F44336',
  },
  pendingChip: {
    backgroundColor: '#C2A27C',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    marginLeft: 5,
  },
  caregiverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  caregiverName: {
    fontSize: 20,
    fontFamily: 'Poppins-Semibold',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 5,
  },
  slot: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  distanceLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
  distance: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  loader: {
    width: 100,
    height: 20,
  },
  additionalInfoHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    marginBottom: 5,
  },
  additionalInfo: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    height: 180,
  },
  actions: {
    flexDirection: 'column',
    marginTop: 'auto',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 30,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#295259',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  cancelledButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
  },
});

export default BookingDetails;
