import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_ENDPOINTS from '../../config/apiEndpoints';
import CaregiverCard from '../components/CaregiverCard';
import { getDistanceMatrix } from '../helpers/distanceMatrixHelper';

type Props = {
  navigation: any;
};

type Caregiver = {
  _id: string;
  name: string;
  experience: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  distance?: string;
};

const AllCaregivers: React.FC<Props> = ({ navigation }) => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('experience');
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [distancesFetched, setDistancesFetched] = useState<boolean>(false);

  useEffect(() => {
    fetchCaregivers();
    fetchUserAddress();
  }, []);

  useEffect(() => {
    if (caregivers.length > 0 && userAddress && !distancesFetched) {
      fetchDistances();
    }
  }, [caregivers, userAddress, distancesFetched]);

  const fetchCaregivers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.GET_ALL_CAREGIVERS);
      const caregiversData: Caregiver[] = response.data;
      setCaregivers(caregiversData);
      setLoading(false);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(caregiversData.map(caregiver => caregiver.category).filter(category => category)));
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  const fetchSeniorAddress = async (seniorId: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.GET_SENIOR_BY_ID(seniorId));
      return response.data;
    } catch (error) {
      console.error('Error fetching senior address:', error);
      throw new Error('Error fetching senior address');
    }
  };

  const fetchUserAddress = async () => {
    try {
      const seniorId = await AsyncStorage.getItem('userId');
      if (!seniorId) {
        Alert.alert('Error', 'User ID is missing.');
        return;
      }

      const seniorData = await fetchSeniorAddress(seniorId);
      const { addressLine1, addressLine2, city, state, zipCode } = seniorData;
      const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${state} ${zipCode}`;

      setUserAddress(fullAddress);
    } catch (error) {
      console.error('Error fetching user address:', error);
    }
  };

  const fetchDistances = async () => {
    if (userAddress) {
      const destinations = caregivers.map(
        caregiver => `${caregiver.addressLine1} ${caregiver.addressLine2}, ${caregiver.city}, ${caregiver.state} ${caregiver.zipCode}`
      );

      try {
        
        const distanceData = await getDistanceMatrix([userAddress], destinations);
        

        const distanceValues = distanceData.rows[0].elements.map((element: any) => ({
          text: element.distance.text,
          value: element.distance.value
        }));
        

        const caregiversWithDistances = caregivers.map((caregiver, index) => ({
          ...caregiver,
          distance: distanceValues[index].text
        }));

        setCaregivers(caregiversWithDistances);
        setDistancesFetched(true); // Mark distances as fetched
      } catch (error) {
        console.error('Error fetching distances:', error);
      }
    }
  };

  const filteredCaregivers = filter
    ? caregivers.filter(caregiver => caregiver.category === filter)
    : caregivers;

  const sortedCaregivers = filteredCaregivers.slice();

  if (sortOption === 'experience') {
    sortedCaregivers.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
  } else if (sortOption === 'distance') {
    sortedCaregivers.sort((a, b) => {
      const distanceA = parseFloat(a.distance?.replace(/[^0-9.]/g, '') || '0');
      const distanceB = parseFloat(b.distance?.replace(/[^0-9.]/g, '') || '0');
      return distanceA - distanceB;
    });
  }

  const handleCaregiverPress = (caregiver: Caregiver) => {
    navigation.navigate('Profile', { caregiver });
  };

  return (
    <View style={styles.container}>
      
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <ScrollView horizontal style={styles.filterContainer} showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtonContainer}>
              <TouchableOpacity style={[styles.filterButton, !filter && styles.activeFilterButton]} onPress={() => setFilter(null)}>
                <Text style={[styles.filterButtonText, !filter && styles.activeFilterText]}>All</Text>
              </TouchableOpacity>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.filterButton, filter === category && styles.activeFilterButton]}
                  onPress={() => setFilter(category)}
                >
                  <Text style={[styles.filterButtonText, filter === category && styles.activeFilterText]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <TouchableOpacity style={[styles.sortButton, sortOption === 'experience' && styles.activeSortButton]} onPress={() => setSortOption('experience')}>
              <Text style={[styles.sortButtonText, sortOption === 'experience' && styles.activeSortText]}>Experience</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortButton, sortOption === 'distance' && styles.activeSortButton]} onPress={() => setSortOption('distance')}>
              <Text style={[styles.sortButtonText, sortOption === 'distance' && styles.activeSortText]}>Distance</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {sortedCaregivers.map((caregiver, index) => (
              <TouchableOpacity key={index} onPress={() => handleCaregiverPress(caregiver)}>
                <CaregiverCard
                  caregiver={caregiver}
                  navigation={navigation}
                  distance={caregiver.distance} // Pass distance to CaregiverCard
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  filterContainer: {
    marginBottom: 20,
    height: 70, // Fixed height for the filter container
    maxHeight: 70, // Ensure the filter container does not grow beyond 60px
  },
  filterButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    justifyContent: 'center', // Center the text vertically
  },
  filterButtonText: {
    color: '#4A4A4A',
    fontSize: 18,
  },
  activeFilterButton: {
    backgroundColor: '#295259',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  sortButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  sortButtonText: {
    color: '#4A4A4A',
    fontSize:18
  },
  activeSortButton: {
    backgroundColor: '#295259',
  },
  activeSortText: {
    color: '#ffffff',
  },
});

export default AllCaregivers;
