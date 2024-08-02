import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type BookingCardProps = {
  booking: {
    _id: string;
    slots: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
    status: string;
    additionalInfo: string;
    seniorId: string;
    caregiverId: string;
    date: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  caregiver: {
    _id: string;
    name: string;
    imageUrl: string;
  };
};

const getSlotText = (slots: { morning: boolean; afternoon: boolean; evening: boolean }) => {
  if (slots.morning) return 'Morning';
  if (slots.afternoon) return 'Afternoon';
  if (slots.evening) return 'Evening';
  return '';
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, caregiver }) => {
  const avatarUrl = caregiver?.imageUrl
    ? caregiver.imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver?.name || 'Unknown')}&background=295259&color=fff&size=200&rounded=true`;

  return (
    <View style={styles.bookingCard}>
      <Text>Caregiver: {caregiver?.name || 'Unknown'}</Text>
      <Text>Slot: {getSlotText(booking.slots)}</Text>
      <Text>Additional Info: {booking.additionalInfo}</Text>
      <Image source={{ uri: avatarUrl }} style={styles.caregiverImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  caregiverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
});

export default BookingCard;
