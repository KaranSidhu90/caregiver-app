import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { getAvatarUrl, calculateAge } from '../helpers/common';
import { useNavigation } from '@react-navigation/native';
import { RequestDetailScreenNavigationProp } from '../../@types/types';

type Props = {
  data: any;
  iconColor?: string;   // Optional prop for custom icon color
  buttonColor?: string; // Optional prop for custom button color
};

const CaregiverRequestCard: React.FC<Props> = ({ data, iconColor = "#C2A27C", buttonColor = "#C2A27C" }) => {
  // Hook to access navigation object for navigating to the request detail screen
  const navigation = useNavigation<RequestDetailScreenNavigationProp>();
  
  // Destructuring the relevant data from the provided data prop
  const { seniorDetails, date, slots, distance, status } = data;

  // Early return if seniorDetails are not available
  if (!seniorDetails) {
    return <Text>No senior details available.</Text>;
  }

  // Get the avatar URL for the senior, using a helper function
  const avatarUrl = getAvatarUrl(seniorDetails.name || "Unknown", seniorDetails.imageUrl);

  // Calculate the age of the senior using their date of birth
  const age = calculateAge(seniorDetails.dob);

  // Determine the time slot based on the provided slots
  const timeSlot = slots.morning
    ? "8AM - 12PM"
    : slots.afternoon
    ? "1PM - 5PM"
    : "6PM - 10PM";

  // Format the date using moment.js
  const formattedDate = moment.utc(date).format("dddd, Do MMMM, YYYY");

  // Function to format care types into readable text
  const formatCareType = (careType: string) => {
    return careType
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  // Format and join all care needs into a string
  const formattedCareNeeds = seniorDetails.careNeeds.map((careType: string) => formatCareType(careType)).join(", ");
  
  // Navigate to the RequestDetailScreen with the current data when details button is pressed
  const openDetails = () => {
    navigation.navigate('RequestDetailScreen', { request: data });
  };

  // Determine the status icon, text, and color based on the booking status
  const statusIcon = status === "Accepted" ? "check-circle" : "hourglass-empty";
  const statusText = status === "Accepted" ? "Accepted" : "Pending";
  const statusColor = status === "Accepted" ? "#4CAF50" : "#295259";

  // Function to get the chip style based on the booking status
  const getChipStyle = () => {
    return {
      backgroundColor: status === "Accepted" ? "#9FD4A3" : "#C2A27C",
    };
  };

  // Render the caregiver request card UI
  return (
      <View style={styles.cardWrapper}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.title}>
            Caregiver required in {seniorDetails.city || "Unknown"} for {formattedCareNeeds || "Unknown Care"}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <View style={styles.column}>
              <View style={styles.infoRowItem}>
                <FontAwesome5 name="user" size={20} color={iconColor} />
                <Text style={styles.infoText}>
                  {age}, {seniorDetails.gender || "Unknown"}
                </Text>
              </View>
              <View style={styles.infoRowItem}>
                <FontAwesome5 name="map-marker-alt" size={20} color={iconColor} />
                <Text style={styles.infoText}>
                  {seniorDetails.city || "Unknown"}, {seniorDetails.state || "Unknown"}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.infoRowItem}>
                <FontAwesome5 name="location-arrow" size={20} color={iconColor} />
                <Text style={styles.infoText}>{distance || "Unknown"}</Text>
              </View>
              <View style={styles.infoRowItem}>
                <FontAwesome5 name="clock" size={20} color={iconColor} />
                <Text style={styles.infoText}>{timeSlot}</Text>
              </View>
            </View>
          </View>
          <View style={styles.centeredDate}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={[styles.statusChip, getChipStyle()]}>
            <Icon name={statusIcon} size={16} color={statusColor} />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.button, styles.detailsButton, { backgroundColor: buttonColor }]} onPress={openDetails}>
          <Text style={styles.buttonText}>DETAILS</Text>
        </TouchableOpacity>
      </View>
  );
};

// Styles for the caregiver request card
const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: "#A6A3B8",
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#295259",
    flex: 1,
    flexWrap: 'wrap',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  infoRowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#2D2D2D",
    marginLeft: 8,
  },
  centeredDate: {
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#295259",
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Semibold',
    marginLeft: 5,
    color: '#4A4A4A',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  detailsButton: {
    backgroundColor: "#C2A27C",
    width: "100%",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default CaregiverRequestCard;
