import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import BookingDetails from './BookingDetails';
import { getAvatarUrl } from '../helpers/common';

type Props = {
  booking: any;
  caregiver: any;
  onBookingChange: (bookingId: string) => void;
};

const BookingCard: React.FC<Props> = ({ booking, caregiver, onBookingChange }) => {
  const avatarUrl = getAvatarUrl(
    caregiver ? caregiver.name : 'Unknown',
    caregiver?.imageUrl,
    booking.status === 'Completed' || booking.status === 'Cancelled' ? 'ffffff' : '295259',
    booking.status === 'Completed' ? '295259' : booking.status === 'Cancelled' ? 'F44336' : 'ffffff'
  );

  const getCardStyle = () => {
    switch (booking.status) {
      case 'Accepted':
        return styles.acceptedCard;
      case 'Completed':
        return styles.completedCard;
      case 'Cancelled':
        return styles.cancelledCard;
      default:
        return styles.pendingCard;
    }
  };

  const getTextStyle = () => {
    switch (booking.status) {
      case 'Accepted':
        return styles.activeText;
      case 'Completed':
      case 'Cancelled':
        return styles.whiteText;
      default:
        return styles.pendingText;
    }
  };

  const getIcon = () => {
    switch (booking.status) {
      case 'Accepted':
        return 'check-circle';
      case 'Completed':
        return 'done';
      case 'Cancelled':
        return 'cancel';
      default:
        return 'hourglass-empty';
    }
  };

  const getIconColor = () => {
    return booking.status === 'Completed' || booking.status === 'Cancelled' ? '#ffffff' : '#4A4A4A';
  };

  const getChipStyle = () => {
    switch (booking.status) {
      case 'Accepted':
        return styles.acceptedChip;
      case 'Completed':
        return styles.completedChip;
      case 'Cancelled':
        return styles.cancelledChip;
      default:
        return styles.pendingChip;
    }
  };

  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const openActionSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={openActionSheet} style={[styles.card, getCardStyle()]}>
        <Image source={{ uri: avatarUrl }} style={styles.caregiverImage} />
        <View style={styles.info}>
          <Text style={[styles.caregiverName, getTextStyle()]}>{caregiver ? caregiver.name : 'Unknown Caregiver'}</Text>
          <Text style={[styles.slot, getTextStyle()]}>{getSlotText(booking.slots)}</Text>
          <View style={[styles.chip, getChipStyle()]}>
            <Icon name={getIcon()} size={18} color={getIconColor()} />
            <Text style={[styles.chipText, getTextStyle()]}>{booking.status}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <ActionSheet ref={actionSheetRef}>
        <BookingDetails
          booking={booking}
          caregiver={caregiver}
          onClose={() => actionSheetRef.current?.setModalVisible(false)}
          onBookingChange={onBookingChange}
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
  completedCard: {
    backgroundColor: '#295259',
  },
  cancelledCard: {
    backgroundColor: '#F44336',
  },
  pendingCard: {
    backgroundColor: '#C2A27C',
  },
  caregiverImage: {
    width: 80,
    height: 80,
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
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 5,
    width: 110,
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
  chipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
  },
  activeText: {
    color: '#4A4A4A',
  },
  whiteText: {
    color: '#ffffff',
  },
  pendingText: {
    color: '#4A4A4A',
  },
});

export default BookingCard;
