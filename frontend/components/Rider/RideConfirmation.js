import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode } from 'jwt-decode';

const RideConfirmationScreen = () => {
  const [drivers, setDrivers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      const token = await fetchUserInfo();
      if (token) {
        setUser((prevUser) => ({ ...prevUser, token }));
      }
    };
    initializeApp();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (user && user.token) {
      connectWebSocket(user.token);
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const userData = {
          _id: decoded.user_id || 'default_id',
          name: decoded.name || 'User',
          email: decoded.email || 'user@example.com',
          profilePic: decoded.profilePic || 'https://via.placeholder.com/150',
        };
        setUser(userData);
        return token;
      } else {
        setUser({
          _id: 'default_id',
          name: 'User',
          email: 'user@example.com',
          profilePic: 'https://via.placeholder.com/150',
        });
        return null;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser({
        _id: 'default_id',
        name: 'User',
        email: 'user@example.com',
        profilePic: 'https://via.placeholder.com/150',
      });
      return null;
    }
  };

  const connectWebSocket = (token) => {
    socketRef.current = io(`https://${process.env.EXPO_PUBLIC_API_MATCHING_API}`, {
      query: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      if (user) {
        const registerRider = {
          type: 'register',
          riderId: user._id,
        };
        socketRef.current.emit('register', registerRider);
      }
      setIsConnected(true);
    });

    socketRef.current.on('update', (data) => {
      setDrivers(data.drivers || []);
      setRiders(data.riders || []);
    });

    socketRef.current.on('rideAccepted', (data) => {
      console.log(`Ride accepted by driver ${data.driverId}`);
      setRideStatus('accepted');
    });

    socketRef.current.on('rideDeclined', () => {
      console.log('Ride declined');
      setRideStatus('declined');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });
  };

  const handleRequestRide = () => {
    if (user) {
      const rideRequest = {
        userId: user._id,
        userName: user.name,
        pickup: 'User Pickup Location',
        dropoff: 'User Dropoff Location',
      };
      socketRef.current.emit('requestRide', rideRequest);
      setRideStatus('requesting');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Drivers:</Text>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.driverId}
        renderItem={({ item }) => (
          <Text>{item.driverId} - {item.available ? 'Available' : 'Busy'}</Text>
        )}
      />
      <Text style={styles.heading}>Riders:</Text>
      <FlatList
        data={riders}
        keyExtractor={(item) => item.riderId}
        renderItem={({ item }) => (
          <Text>{item.riderId}</Text>
        )}
      />
      {isConnected && (
        <Button
          title={rideStatus === 'requesting' ? 'Requesting Ride...' : 'Request Ride'}
          onPress={handleRequestRide}
          disabled={rideStatus === 'requesting'}
        />
      )}
      {rideStatus === 'accepted' && <Text style={styles.status}>Ride Accepted!</Text>}
      {rideStatus === 'declined' && <Text style={styles.status}>Ride Declined.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default RideConfirmationScreen;
