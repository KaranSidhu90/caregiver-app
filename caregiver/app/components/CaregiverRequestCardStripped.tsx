import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { RequestDetailScreenNavigationProp } from '../../@types/types';

// Define the structure for the Booking type
type Booking = {
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
  seniorDetails: {
    careNeeds: string[];
    ailmentCategories: string[];
    ailments: string[];
    userType: string;
    _id: string;
    name: string;
    phoneNumber: string;
    gender: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    imageUrl: string;
  };
  distance?: string;
  caregiverAddress?: string;
  bookingStatus: string;
};

// Define the structure for status colors, allowing any string as a key
type StatusColors = {
  [key: string]: string; // Allow any string as the key
};

// Define the component props, including the data and optional statusColors
type Props = {
  data: Booking;
  statusColors?: StatusColors; // Use the StatusColors type
};

// Main component to display the Caregiver Request Card
const CaregiverRequestCardStripped: React.FC<Props> = ({ data, statusColors = {} }) => {
  const navigation = useNavigation<RequestDetailScreenNavigationProp>(); // Hook for navigation
  const { seniorDetails, date, slots, status, distance } = data; // Destructuring relevant data

  // Format the booking date using moment.js
  const formattedDate = moment.utc(date).format("dddd, Do MMMM, YYYY");

  // Determine the time slot based on the slots provided
  const timeSlot = slots.morning
    ? "8AM - 12PM"
    : slots.afternoon
    ? "1PM - 5PM"
    : "6PM - 10PM";

  // Default status colors with primary green for accepted
  const defaultStatusColors: StatusColors = {
    Accepted: "#4CAF50", // Primary green color
    Pending: "#C2A27C",  // Default pending color
  };

  // Determine the color based on the status, using either passed statusColors or default ones
  const statusColor = statusColors[status] || defaultStatusColors[status] || "#C2A27C";

  // Function to navigate to the RequestDetailScreen with the current booking data
  const openDetails = () => {
    navigation.navigate('RequestDetailScreen', { request: data });
  };

  // Render the card UI
  return (
    <TouchableOpacity style={[styles.cardWrapper, { borderColor: statusColor }]} onPress={openDetails}>
      <View style={styles.cardContent}>
        <Text style={styles.nameText}>{seniorDetails.name}</Text>
        <Text style={styles.requirementText}>
          {seniorDetails.careNeeds.join(", ") || "No specific requirements"}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.timeSlotText}>{timeSlot}</Text>
        <Text style={styles.distanceText}>{distance || "Distance not available"}</Text>
        <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Styles for the Caregiver Request Card
const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 8,
    padding: 16,
    borderWidth: 2, // Border width to visually represent the status color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  cardContent: {
    flexDirection: 'column', // Stack content vertically
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#295259",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  timeSlotText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start', // Align the status chip to the start (left) of the container
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    color: "#ffffff", // White color for status text to contrast with the background color
  },
});

export default CaregiverRequestCardStripped;
