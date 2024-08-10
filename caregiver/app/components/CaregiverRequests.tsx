import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import API_ENDPOINTS from "../../config/apiEndpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CaregiverRequestCard from "./CaregiverRequestCard";

const CaregiverRequests: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState();

  useEffect(() => {
    fetchRequestById();
  }, []);

  const fetchRequestById = async () => {
    const storedUserId = await AsyncStorage.getItem("userId");

    try {
      const response = await axios.get(
        API_ENDPOINTS.BOOKINGS.GET_BY_CAREGIVER_ID(storedUserId!)
      );
      setRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.requestsList}>
        {requests &&
          requests.map((req) => {
            return <CaregiverRequestCard key={req._id} data={req} />;
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
    color: "#fff",
    fontSize: 18,
  },
  requestsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
});

export default CaregiverRequests;
