import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';

const DriverScreen = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchUserInfo();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUser({
          _id: decoded.user_id,
          name: decoded.name,
        });
        connectWebSocket(token);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const connectWebSocket = (token) => {
    socketRef.current = io('https://matching.saipriya.org', {
      query: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      const registerDriver = {
        type: 'driver',
        driverId: user._id,
        available: isAvailable,
      };
      socketRef.current.emit('register', registerDriver);
    });

    socketRef.current.on('rideRequested', (data) => {
      console.log(`Ride requested: ${data.rideId} from rider ${data.riderId} (${data.riderName})`);
      setRideRequest(data);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const toggleAvailability = () => {
    setIsAvailable((current) => {
      const newStatus = !current;
      socketRef.current.emit('setAvailability', { available: newStatus });
      return newStatus;
    });
  };

  const handleRideRequest = (accept) => {
    if (accept) {
      console.log('Accepting ride request:', rideRequest);
      socketRef.current.emit('rideResponse', {
        accepted: true,
        rideId: rideRequest.rideId,
      });
    } else {
      console.log('Declining ride request:', rideRequest);
      socketRef.current.emit('rideResponse', {
        accepted: false,
        rideId: rideRequest.rideId,
      });
    }
    setRideRequest(null);
  };

  return (
    <View style={styles.container}>
      <Text>Driver: {user ? user.name : 'Loading...'}</Text>
      <TouchableOpacity
        style={[styles.availabilityButton, isAvailable && styles.availabilityButtonActive]}
        onPress={toggleAvailability}
      >
        <Text style={styles.availabilityButtonText}>{isAvailable ? 'Available' : 'Unavailable'}</Text>
      </TouchableOpacity>
      {rideRequest && (
        <View style={styles.rideRequestContainer}>
          <Text>Ride Request from {rideRequest.riderName}</Text>
          <View style={styles.rideRequestButtons}>
            <TouchableOpacity
              style={[styles.rideRequestButton, styles.acceptButton]}
              onPress={() => handleRideRequest(true)}
            >
              <Text style={styles.rideRequestButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rideRequestButton, styles.declineButton]}
              onPress={() => handleRideRequest(false)}
            >
              <Text style={styles.rideRequestButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availabilityButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  availabilityButtonActive: {
    backgroundColor: 'green',
  },
  availabilityButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rideRequestContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  rideRequestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  rideRequestButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  declineButton: {
    backgroundColor: 'red',
  },
  rideRequestButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DriverScreen;