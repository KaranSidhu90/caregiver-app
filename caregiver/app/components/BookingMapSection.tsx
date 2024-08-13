import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import customMapStyle from '../../utils/customMapStyle'; 

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY = 'AIzaSyCgsbtZURC888Fk6uGB0vMgCtBgfXTuv6Q'; // Replace with your API key

Geocoder.init(GOOGLE_MAPS_APIKEY);

type BookingMapSectionProps = {
  caregiverAddress: string;
  seniorAddress: string;
};

const BookingMapSection: React.FC<BookingMapSectionProps> = ({ caregiverAddress, seniorAddress }) => {
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
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

        setOrigin({ latitude: caregiverLocation.lat, longitude: caregiverLocation.lng });
        setDestination({ latitude: seniorLocation.lat, longitude: seniorLocation.lng });
      } catch (error) {
        console.error("Error fetching coordinates: ", error);
      }
    };

    fetchCoordinates();
  }, [caregiverAddress, seniorAddress]);

  const handleMapPress = async () => {
    if (!origin || !destination) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open map URL:", error);
    }
  };

  if (!origin || !destination) {
    return <Text>Loading map...</Text>;
  }

  // Calculate the latitude and longitude deltas
  const calculateRegionDelta = (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
    const latDelta = Math.abs(origin.latitude - destination.latitude) * 1.6;
    const lngDelta = Math.abs(origin.longitude - destination.longitude) * 1.6;
    return {
      latitudeDelta: Math.max(latDelta, latDelta), // Ensure delta is not too small
      longitudeDelta: Math.max(lngDelta, lngDelta),
    };
  };

  const region = {
    latitude: (origin.latitude + destination.latitude) / 2,
    longitude: (origin.longitude + destination.longitude) / 2,
    ...calculateRegionDelta(origin, destination),
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMapPress}>
        <MapView
          key={`${origin.latitude}-${destination.latitude}`} // Force re-render
          initialRegion={region}
          style={styles.map}
          scrollEnabled={false} // Disable map scrolling
          rotateEnabled={false} // Disable rotation
          pitchEnabled={false} // Disable pitch (tilt)
          zoomEnabled={false} // Disable zoom
          customMapStyle={customMapStyle} // Sepia styled map
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
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={result => {
              setDistance(parseFloat(result.distance.toFixed(2))); // Round distance to 2 decimal places
            }}
            onError={(errorMessage) => {
              console.error('Error fetching directions:', errorMessage);
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
    width: width,  // Use the full width
    height: 400,   // Ensure height is enough to display the map
    borderRadius: 10,
    marginTop: 10,
  },
});

export default BookingMapSection;
