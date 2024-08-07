import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DashboardHeader from "../components/DashboardHeader";
import { initializeAuthToken } from "../../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: any;
};

const CaregiverDashboard: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User"); // Default user name
  const [userId, setUserId] = useState(""); // User ID

  useEffect(() => {
    const fetchData = async () => {
      await initializeAuthToken(); // Initialize the token before making requests
      await fetchUserDetails();

      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // Retrieve user details from AsyncStorage
      const fullName = await AsyncStorage.getItem("userName");
      const storedUserId = await AsyncStorage.getItem("userId");
      if (fullName) {
        const firstName = fullName.split(" ")[0]; // Use only the first part of the name
        setUserName(firstName);
      }
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getTimeOfDayGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const timeOfDayGreeting = getTimeOfDayGreeting();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader
        bgColor="#C2A27C"
        name={userName}
        timeOfDay={timeOfDayGreeting}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.dataContainer}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollViewContent: {
    height: "100%",
    zIndex: 999,
    width: "100%",
  },
  dataContainer: {
    backgroundColor: "#787878",
    position: "absolute",
    borderRadius: 20,
    padding: 20,
    zIndex: 999,
    height: "120%",
    width: "100%",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CaregiverDashboard;
