import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from '../../config/apiEndpoints';
import CaregiverRequestCard from './CaregiverRequestCard';
import { getDistanceMatrix } from '../helpers/distanceMatrixHelper';

type Booking = {
  _id: string;
  seniorId: string;
  caregiverId: string;
  date: string;
  slots: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  additionalInfo: string;
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

const CaregiverBookingList: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to manage loading status
  const [bookings, setBookings] = useState<Booking[]>([]); // State to hold bookings data
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to hold error messages
  const [distancesFetched, setDistancesFetched] = useState<boolean>(false); // State to track if distances have been fetched
  const [userAddress, setUserAddress] = useState<string | null>(null); // State to hold the user's address

  useEffect(() => {
    fetchCaregiverDetails(); // Fetch caregiver details on component mount
  }, []);

  useEffect(() => {
    if (bookings.length > 0 && userAddress && !distancesFetched) {
      fetchDistances(); // Fetch distances once bookings and user address are available
    }
  }, [bookings, userAddress, distancesFetched]);

  // Fetches caregiver details from AsyncStorage and the API
  const fetchCaregiverDetails = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (!storedUserId) {
      setErrorMessage("User ID not found");
      setIsLoading(false);
      return;
    }

    try {
      const caregiverResponse = await axios.get(API_ENDPOINTS.USERS.GET_CAREGIVER_BY_ID(storedUserId));
      const caregiverData = caregiverResponse.data;
      const { addressLine1, addressLine2, city, state, zipCode } = caregiverData;
      const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${state} ${zipCode}`;
      setUserAddress(fullAddress); // Set the user's full address
      fetchBookings(storedUserId); // Fetch bookings after setting the user address
    } catch (error) {
      setErrorMessage("An error occurred while fetching caregiver details.");
      setIsLoading(false);
    }
  };

  // Fetches bookings for the caregiver based on their ID
  const fetchBookings = async (caregiverId: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_CAREGIVER_ID_DETAILS(caregiverId)+ "?status=Accepted");
      const acceptedBookings = response.data;
      console.log('acceptedBookings', acceptedBookings);
      setBookings(acceptedBookings); // Set the fetched bookings
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage("No Bookings Found");
        } else {
          setErrorMessage("An error occurred while fetching bookings.");
        }
      } else {
        setErrorMessage("An error occurred while fetching bookings.");
      }
      setIsLoading(false);
    }
  };

  // Fetches distances between the caregiver's address and each booking's location
  const fetchDistances = async () => {
    if (userAddress) {
      const destinations = bookings.map(
        booking => `${booking.seniorDetails.addressLine1} ${booking.seniorDetails.addressLine2}, ${booking.seniorDetails.city}, ${booking.seniorDetails.state} ${booking.seniorDetails.zipCode}`
      );

      try {
        const distanceData = await getDistanceMatrix([userAddress], destinations);

        const distanceValues = distanceData.rows[0].elements.map((element: any) => ({
          text: element.distance.text,
          value: element.distance.value
        }));

        const bookingsWithDistances = bookings.map((booking, index) => ({
          ...booking,
          distance: distanceValues[index].text,
          caregiverAddress: userAddress
        }));

        setBookings(bookingsWithDistances); // Set bookings with distances included
        setDistancesFetched(true); // Mark distances as fetched
      } catch (error) {
        console.error('Error fetching distances:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text> 
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text> 
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.bookingsList}>
        {bookings &&
          bookings.map((booking) => {
            return (
              <CaregiverRequestCard
                key={booking._id}
                data={booking}
                iconColor="#295259" 
                buttonColor="#295259" 
              />
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#295259",
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#295259",
    fontSize: 18,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 120,
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
});

export default CaregiverBookingList;
