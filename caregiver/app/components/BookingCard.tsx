import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import BookingDetails from './BookingDetails';
import { getAvatarUrl } from '../helpers/common';

type Props = {
  booking: any;
  caregiver: any;
  onBookingChange: (bookingId: string) => void; // Add this prop
};

const BookingCard: React.FC<Props> = ({ booking, caregiver, onBookingChange }) => {
  const avatarUrl = getAvatarUrl(caregiver ? caregiver.name : 'Unknown', caregiver?.imageUrl);

  const isAccepted = booking.status === 'Accepted';
  const cardStyle = isAccepted ? styles.acceptedCard : styles.pendingCard;
  const textStyle = isAccepted ? styles.acceptedText : styles.pendingText;
  const icon = isAccepted ? 'check-circle' : 'hourglass-empty';

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const openActionSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(true);
    }
  };

  const handleCloseActionSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={openActionSheet} style={[styles.card, cardStyle]}>
        <Image source={{ uri: avatarUrl }} style={styles.caregiverImage} />
        <View style={styles.info}>
          <Text style={[styles.caregiverName, textStyle]}>{caregiver ? caregiver.name : 'Unknown Caregiver'}</Text>
          <Text style={[styles.slot, textStyle]}>{getSlotText(booking.slots)}</Text>
          <Text style={[styles.slot, textStyle]}>{booking.date.split('T')[0]}</Text>
          <View style={[styles.chip, isAccepted ? styles.acceptedChip : styles.pendingChip]}>
            <Icon name={icon} size={14} color={isAccepted ? '#4A4A4A' : '#4A4A4A'} />
            <Text style={[styles.chipText, textStyle]}>{isAccepted ? 'Accepted' : 'Pending'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
        <BookingDetails
          booking={booking}
          caregiver={caregiver}
          onClose={handleCloseActionSheet}
          onBookingChange={onBookingChange} // Pass the prop
        />
      </ActionSheet>
    </>
  );
};

const getSlotText = (slots: { morning: boolean; afternoon: boolean; evening: boolean }) => {
  if (slots.morning) return 'Morning (8AM - 12PM)';
  if (slots.afternoon) return 'Afternoon (1PM - 5PM)';
  if (slots.evening) return 'Evening (6PM - 10PM)';
  return '';
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
  },
  acceptedCard: {
    backgroundColor: '#9FD4A3',
  },
  pendingCard: {
    backgroundColor: '#C2A27C',
  },
  caregiverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  caregiverName: {
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
  },
  slot: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 5,
    width: 110,
  },
  acceptedChip: {
    backgroundColor: '#9FD4A3',
  },
  pendingChip: {
    backgroundColor: '#C2A27C',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
  },
  acceptedText: {
    color: '#4A4A4A',
  },
  pendingText: {
    color: '#4A4A4A',
  },
});

export default BookingCard;
