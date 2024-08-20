import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tabs from '../components/Tabs';
import { getAvatarUrl, calculateAge } from '../helpers/common';
import { format } from 'date-fns';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
  request: any; // Type for the request object passed as a prop
  onClose: () => void; // Function to close the details screen
  onConfirmRequest: (requestId: string) => void; // Function to handle request confirmation
  onDeclineRequest: (requestId: string) => void; // Function to handle request decline
};

const CaregiverRequestDetails: React.FC<Props> = ({ request, onClose, onConfirmRequest, onDeclineRequest }) => {
  const { seniorDetails, date, distance, additionalInfo } = request; // Destructure the relevant properties from the request object
  const { ailmentCategories, ailments, careNeeds } = seniorDetails || {}; // Destructure nested properties, or set to an empty object if undefined

  const [activeTab, setActiveTab] = useState('Details'); // State to track which tab is currently active

  // Effect that runs when the request changes
  useEffect(() => {
    // Perform any side effects or data fetching here based on the request
  }, [request]);

  // Early return if seniorDetails is not available
  if (!seniorDetails) {
    return <Text>No senior details available.</Text>;
  }

  // Another effect that runs when seniorDetails changes (could be combined with the previous effect if necessary)
  useEffect(() => {
    // Perform any side effects based on seniorDetails here
  }, [seniorDetails]);

  // Generate the avatar URL using a helper function
  const avatarUrl = getAvatarUrl(seniorDetails.name || "Unknown", seniorDetails.imageUrl);

  // Function to format care types into a more readable format
  const formatCareType = (careType: string) => {
    return careType
      .replace(/([A-Z])/g, ' $1') // Add a space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  // Format the first care need or set to 'Unknown Care' if undefined
  const formattedCareNeeds = careNeeds ? formatCareType(careNeeds[0]) : 'Unknown Care';

  // Define the tabs for the tabbed interface
  const tabs = [
    { label: 'Details', value: 'Details' }, // Tab for details
    { label: 'Special Needs', value: 'SpecialNeeds' }, // Tab for special needs
  ];

  // Function to handle tab selection
  const handleTabPress = (tab: string) => {
    setActiveTab(tab); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{seniorDetails.name || "Unknown"}</Text>
      <Text style={styles.ageGender}>{`${calculateAge(seniorDetails.dob)} Years, ${seniorDetails.gender || "Unknown"}`}</Text>

      <Text style={styles.requirementTitle}>Requirement</Text>
      <Text style={styles.requirement}>{formattedCareNeeds}</Text>

      <Tabs tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.tabContainer}>
          {activeTab === 'Details' ? (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.additionalInfo}>
                {additionalInfo || 'No additional details provided.'}
              </Text>
            </View>
          ) : (
            <View style={styles.specialNeedsContainer}>
              <Text style={styles.specialNeedsHeader}>Ailment Categories</Text>
              <View style={styles.chipsContainer}>
                {ailmentCategories && ailmentCategories.length > 0 ? (
                  ailmentCategories.map((category: string, index: number) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{category}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noSpecialNeedsText}>No ailment categories available.</Text>
                )}
              </View>
              
              <Text style={styles.specialNeedsHeader}>Ailments</Text>
              <View style={styles.chipsContainer}>
                {ailments && ailments.length > 0 ? (
                  ailments.map((ailment: string, index: number) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{ailment}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noSpecialNeedsText}>No ailments available.</Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.mapContainer}>
          <Icon name="location-on" size={24} color="#C2A27C" />
          <Text style={styles.distanceText}>{distance || "Unknown"} away</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{seniorDetails.addressLine1}</Text>
          <Text style={styles.addressText}>{seniorDetails.addressLine2}</Text>
          <Text style={styles.addressText}>{`${seniorDetails.city}, ${seniorDetails.state} ${seniorDetails.zipCode}`}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.bookButton]}>
          <Text style={styles.buttonText}>ACCEPT REQUEST</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.goBackButton]}>
          <Text style={styles.buttonText}>DECLINE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  scrollView: {
    paddingTop: 50,
    marginBottom: 50,
    marginTop: -40,
    maxHeight: '60%',
    zIndex: -10,
  },
  avatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#A6A3B8',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Semibold',
    textAlign: 'center',
    marginBottom: 5,
  },
  ageGender: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 10,
    color: '#C2A27C',
  },
  requirementTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#C2A27C',
  },
  requirement: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  tabContainer: {
    zIndex: -10,
    borderRadius: 10,
    paddingVertical: 30,
    backgroundColor: '#295259',
    color: '#ffffff',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailsTab: {
    flex: 1,
    padding: 10,
    backgroundColor: '#295259',
    borderRadius: 20,
    marginRight: 5,
  },
  specialNeedsTab: {
    backgroundColor: '#C2A27C',
    marginLeft: 5,
  },
  detailsTabText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
    textAlign: 'center',
  },
  specialNeedsText: {
    color: '#ffffff',
  },
  additionalInfoContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  additionalInfoHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    marginBottom: 5,
  },
  additionalInfo: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  specialNeedsContainer: {
    padding: 15,
    marginBottom: 15,
  },
  specialNeedsHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    marginBottom: 5,
    color: '#ffffff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#C2A27C',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 4,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  noSpecialNeedsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#C2A27C',
    marginBottom: 10,
  },
  mapContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#C2A27C',
    marginBottom: 5,
  },
  actions: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#295259',
  },
  declineButton: {
    backgroundColor: '#C2A27C',
  },
  addressContainer: {
    marginTop: 15,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#2D2D2D',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '110%',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 35,
    marginVertical: 5,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#295259',
  },
  goBackButton: {
    backgroundColor: '#C2A27C',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default CaregiverRequestDetails;
