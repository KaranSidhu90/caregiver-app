import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import customMapStyle from '../../utils/customMapStyle'; 

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = 'AIzaSyCgsbtZURC888Fk6uGB0vMgCtBgfXTuv6Q'; // Replace with your API key

Geocoder.init(GOOGLE_MAPS_APIKEY); // Initialize Geocoder with API key

type BookingMapSectionProps = {
  caregiverAddress: string;
  seniorAddress: string;
};

const BookingMapSection: React.FC<BookingMapSectionProps> = ({ caregiverAddress, seniorAddress }) => {
  // State to hold the origin (caregiver's address) coordinates
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  // State to hold the destination (senior's address) coordinates
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  // State to hold the calculated distance between origin and destination
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        // Convert caregiverAddress to coordinates
        const caregiverResponse = await Geocoder.from(caregiverAddress);
        const caregiverLocation = caregiverResponse.results[0].geometry.location;

        // Convert seniorAddress to coordinates
        const seniorResponse = await Geocoder.from(seniorAddress);
        const seniorLocation = seniorResponse.results[0].geometry.location;

        // Set the origin and destination coordinates
        setOrigin({ latitude: caregiverLocation.lat, longitude: caregiverLocation.lng });
        setDestination({ latitude: seniorLocation.lat, longitude: seniorLocation.lng });
      } catch (error) {
        console.error("Error fetching coordinates: ", error); // Log errors if any
      }
    };

    fetchCoordinates(); // Fetch coordinates on component mount
  }, [caregiverAddress, seniorAddress]);

  // Handles pressing the map to open directions in Google Maps
  const handleMapPress = async () => {
    if (!origin || !destination) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    try {
      await Linking.openURL(url); // Open Google Maps with the destination
    } catch (error) {
      console.error("Failed to open map URL:", error); // Log errors if any
    }
  };

  if (!origin || !destination) {
    return <Text>Loading map...</Text>; // Show loading text while coordinates are being fetched
  }

  // Calculate the region delta for the map view
  const calculateRegionDelta = (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
    const latDelta = Math.abs(origin.latitude - destination.latitude) * 1.6;
    const lngDelta = Math.abs(origin.longitude - destination.longitude) * 1.6;
    return {
      latitudeDelta: Math.max(latDelta, latDelta), 
      longitudeDelta: Math.max(lngDelta, lngDelta),
    };
  };

  // Define the region for the map view
  const region = {
    latitude: (origin.latitude + destination.latitude) / 2,
    longitude: (origin.longitude + destination.longitude) / 2,
    ...calculateRegionDelta(origin, destination),
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMapPress}>
        <MapView
          key={`${origin.latitude}-${destination.latitude}`} // Force re-render when coordinates change
          initialRegion={region}
          style={styles.map}
          scrollEnabled={false} 
          rotateEnabled={false} 
          pitchEnabled={false}
          zoomEnabled={true}
          customMapStyle={customMapStyle} // Apply custom map styling
        >
          <Marker coordinate={origin} pinColor="#295259" /> 
          <Marker coordinate={destination} pinColor="#C2A27C" />
          <MapViewDirections
            origin={origin}
            destination={destination}
            mode="DRIVING"
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#295259"
            onStart={(params) => {
              // Logic when directions start
            }}
            onReady={result => {
              setDistance(parseFloat(result.distance.toFixed(2))); // Set the distance when ready
            }}
            onError={(errorMessage) => {
              console.error('Error fetching directions:', errorMessage); // Log errors if any
            }}
          />
        </MapView>
      </TouchableOpacity>
      <Text style={styles.distanceText}>
        {distance !== null ? `${distance} km away` : "Calculating distance..."} 
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginTop: -50,
    zIndex: -10,
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#C2A27C',
    marginBottom: 5,
  },
  map: {
    width: width,  
    height: 400,   
    borderRadius: 10,
    marginTop: 10,
  },
});

export default BookingMapSection;
