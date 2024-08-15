import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from '../../config/apiEndpoints';
import CaregiverRequestCard from './CaregiverRequestCard';
import { getDistanceMatrix } from '../helpers/distanceMatrixHelper';

type Request = {
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
};

const CaregiverRequests: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // State for tracking loading state
  const [requests, setRequests] = useState<Request[]>([]); // State for storing requests data
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error messages
  const [distancesFetched, setDistancesFetched] = useState<boolean>(false); // State to track if distances have been fetched
  const [userAddress, setUserAddress] = useState<string | null>(null); // State for storing user's address

  useEffect(() => {
    fetchCaregiverDetails(); // Fetch caregiver details on component mount
  }, []);

  useEffect(() => {
    if (requests.length > 0 && userAddress && !distancesFetched) {
      fetchDistances(); // Fetch distances once requests and user address are available
    }
  }, [requests, userAddress, distancesFetched]);

  // Function to fetch caregiver details using stored user ID
  const fetchCaregiverDetails = async () => {
    const storedUserId = await AsyncStorage.getItem('userId'); // Retrieve stored user ID
    if (!storedUserId) {
      setErrorMessage("User ID not found");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch caregiver details from API
      const caregiverResponse = await axios.get(API_ENDPOINTS.USERS.GET_CAREGIVER_BY_ID(storedUserId));
      const caregiverData = caregiverResponse.data;
      const { addressLine1, addressLine2, city, state, zipCode } = caregiverData;
      const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${state} ${zipCode}`;
      setUserAddress(fullAddress); // Set user address state
      fetchRequests(storedUserId); // Fetch requests associated with the caregiver
    } catch (error) {
      setErrorMessage("An error occurred while fetching caregiver details.");
      setIsLoading(false);
    }
  };

  // Function to fetch requests for the caregiver
  const fetchRequests = async (caregiverId: string) => {
    try {
      // Fetch requests from API
      const response = await axios.get(API_ENDPOINTS.BOOKINGS.GET_BY_CAREGIVER_ID_DETAILS(caregiverId));
      setRequests(response.data); // Set requests state
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage("No Pending Requests");
        } else {
          setErrorMessage("An error occurred while fetching requests.");
        }
      } else {
        setErrorMessage("An error occurred while fetching requests.");
      }
      setIsLoading(false);
    }
  };

  // Function to fetch distance data between user and senior addresses
  const fetchDistances = async () => {
    if (userAddress) {
      const destinations = requests.map(
        request => `${request.seniorDetails.addressLine1} ${request.seniorDetails.addressLine2}, ${request.seniorDetails.city}, ${request.seniorDetails.state} ${request.seniorDetails.zipCode}`
      );

      try {
        // Fetch distance matrix data using a helper function
        const distanceData = await getDistanceMatrix([userAddress], destinations);

        const distanceValues = distanceData.rows[0].elements.map((element: any) => ({
          text: element.distance.text,
          value: element.distance.value
        }));

        // Add distance data to each request
        const requestsWithDistances = requests.map((request, index) => ({
          ...request,
          distance: distanceValues[index].text,
          caregiverAddress: userAddress
        }));

        setRequests(requestsWithDistances); // Update requests with distance information
        setDistancesFetched(true); // Mark distances as fetched
      } catch (error) {
        console.error('Error fetching distances:', error);
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Render error message
  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.requestsList}>
        {requests &&
          requests.map((req) => {
            return <CaregiverRequestCard key={req._id} data={req} />;
          })}
      </View>
    </ScrollView>
  );
};

// Styles for the CaregiverRequests component
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 18,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 120,
  },
  requestsList: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
});

export default CaregiverRequests;
