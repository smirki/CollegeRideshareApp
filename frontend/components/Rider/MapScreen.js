import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = ({ navigation }) => {
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    console.log('Pickup Query:', pickupLocation);
    console.log('Destination Query:', destinationQuery);
  }, [pickupLocation, destinationQuery]);

  const fetchSuggestions = async (query, field) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://${process.env.EXPO_PUBLIC_API_PELIAS_API}/v1/autocomplete?text=${encodeURIComponent(
          query
        )}&focus.point.lat=35.25&focus.point.lon=-80.85`
      );
      const data = await response.json();
      setSuggestions(data.features);
      setActiveInput(field);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = async (suggestion, field) => {
    const { coordinates, label } = suggestion.geometry;
    const selectedLocation = { latitude: coordinates[1], longitude: coordinates[0], label };
  
    if (field === 'pickup') {
      setPickupLocation(selectedLocation);
      console.log(selectedLocation);
      setTimeout(() => setPickupQuery(label), 1);
    } else if (field === 'destination') {
      setDestinationLocation(selectedLocation);
      setTimeout(() => setDestinationQuery(label), 1);
      fetchRoute(selectedLocation);
    }
    setSuggestions([]);
    setActiveInput(null);
  };
  


  const fetchRoute = async (destinationLocation) => {
    if (!pickupLocation || !destinationLocation) {
      return;
    }

    const url = `https://${process.env.EXPO_PUBLIC_API_ROUTING_API}/ors/v2/directions/driving-car?start=${pickupLocation.longitude},${pickupLocation.latitude}&end=${destinationLocation.longitude},${destinationLocation.latitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features[0].geometry.coordinates) {
        const coords = data.features[0].geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        setRouteCoordinates(coords);
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch route:', error);
      Alert.alert('Failed to fetch route. Please try again.');
    }
  };

  const handleUserLocationPress = () => {
    if (userLocation) {
      setPickupLocation(userLocation);
      setPickupQuery('Current Location');
    }
  };

  const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ];
  
  

  const handleFindRide = () => {
    if (pickupLocation && destinationLocation) {
      navigation.navigate('RideConfirmation', {
        pickup: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
        },
        destination: {
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
        },
      });
    } else {
      Alert.alert('Please select both pickup and destination locations.');
    }
  };

  const renderSuggestions = () => {
    return (
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSuggestionSelect(item, activeInput)}
            accessibilityLabel={item.properties.label}
            accessibilityRole="button"
          >
            <Image
              source={require('../../assets/pickup-marker.png')}
              style={styles.suggestionIcon}
              accessibilityLabel="Location Icon"
            />
            <Text style={styles.suggestionText}>{item.properties.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.properties.label}
        style={styles.suggestionsList}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView
      provider="google"
  ref={mapRef}
  style={styles.map}
  initialRegion={{
    latitude: 35.3088,
    longitude: -80.7444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  customMapStyle={darkMapStyle} // Apply the dark map style
  accessibilityLabel="Map"
>
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#FECC4C" />
        )}
        {pickupLocation && (
          <Marker coordinate={pickupLocation} accessibilityLabel="Pickup Location">
            <Image
              source={require('../../assets/pickup-marker.png')}
              style={styles.markerImage}
              accessibilityLabel="Pickup Marker"
            />
          </Marker>
        )}
        {destinationLocation && (
          <Marker coordinate={destinationLocation} accessibilityLabel="Destination Location">
            <Image
              source={require('../../assets/destination-marker.png')}
              style={styles.markerImage}
              accessibilityLabel="Destination Marker"
            />
          </Marker>
        )}
        {userLocation && (
          <Marker coordinate={userLocation} accessibilityLabel="User Location">
            <TouchableOpacity
              style={styles.userLocationButton}
              onPress={handleUserLocationPress}
              accessibilityLabel="Use Current Location"
              accessibilityRole="button"
            >
              <Ionicons name="location" size={24} color="#FECC4C" />
            </TouchableOpacity>
          </Marker>
        )}
      </MapView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="location" size={20} color="#FECC4C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={pickupQuery || "Pickup Location"}
            placeholderTextColor={pickupQuery ? "white" : "#7e7e7e"}
            value={pickupQuery}
            onChangeText={(text) => {
              setPickupQuery(text);
              fetchSuggestions(text, 'pickup');
            }}
            accessibilityLabel="Pickup Location Input"
            accessibilityHint="Enter pickup location"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="pin" size={20} color="#FECC4C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={destinationQuery || "Destination Location"}
            placeholderTextColor={destinationQuery ? "white" : "#7e7e7e"}
            value={destinationQuery}
            onChangeText={(text) => {
              setDestinationQuery(text);
              fetchSuggestions(text, 'destination');
            }}
            accessibilityLabel="Destination Location Input"
            accessibilityHint="Enter destination location"
          />
        </View>
      </View>

      {suggestions.length > 0 && renderSuggestions()}

      <TouchableOpacity
        style={styles.findRideButton}
        onPress={handleFindRide}
        accessibilityLabel="Find Ride"
        accessibilityRole="button"
      >
        <Text style={styles.findRideButtonText}>Find Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  inputContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#424242',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'white',
  },
  findRideButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#FECC4C',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  findRideButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  userLocationButton: {
    backgroundColor: '#424242',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FECC4C',
  },
  suggestionsList: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#232323',
    borderRadius: 5,
    maxHeight: 200,
    zIndex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#424242',
  },
  suggestionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: 'white',
  },
});

export default MapScreen;