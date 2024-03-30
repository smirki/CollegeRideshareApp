import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode} from 'jwt-decode'; // Updated import

const RideConfirmationScreen = () => {
  const [drivers, setDrivers] = useState(null);
  const [riders, setRiders] = useState([]);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const socketRef = useRef(null);

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
      setIsConnected(true);
      if (user) {
        const registerRider = {
          type: 'register',
          riderId: user._id,
        };
        socketRef.current.emit('register', registerRider);
      }
    });

    socketRef.current.on('update', (data) => {
      setDrivers(data.drivers || []);
      setRiders(data.riders || []);
    }); 

    socketRef.current.on('rideAccepted', (data) => {
      console.log(`Rider ${user._id} (${user.name})'s ride request accepted by driver ${data.driverId}`);
      setRideStatus('accepted');
      setDriver(data.driverId);
    });

    socketRef.current.on('rideDeclined', () => {
      console.log('Ride declined');
      setRideStatus('declined');
      alert('No drivers available at the moment. Please try again later.');
    });

    socketRef.current.on('disconnect', () => {
      console.log(`Disconnected from server with socket ID: ${socketRef.current.id}`);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.log(`Connection error: ${error}`);
    });
  };

  useEffect(() => {
    fetchUserInfo();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleRequestRide = () => {
    if (user) {
      socketRef.current.emit('requestRide', {
        userId: user._id,
        userName: user.name,
        pickup: 'User Pickup Location',
        dropoff: 'User Dropoff Location',
      });
      setRideStatus('requesting');
      console.log(`Rider ${user._id} (${user.name}) requested a ride`);
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
