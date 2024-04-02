import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';

const DriverScreen = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      disconnectWebSocket();
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
          _id: decoded.user_id,
          name: decoded.name,
        };
        setUser(userData);
        return token;
      }
    } catch (error) {
      console.log('Error:', error);
    }
    return null;
  };

  const connectWebSocket = (token) => {
    socketRef.current = io('https://matching.saipriya.org', {
      query: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      if (user) {
        const registerDriver = {
          type: 'driver',
          driverId: user._id,
          available: isAvailable,
        };
        socketRef.current.emit('register', registerDriver);
      }
    });

    socketRef.current.on('rideRequested', (data) => {
      console.log(`Ride requested: ${data.rideId} from rider ${data.riderId} (${data.riderName})`);
      setRideRequest(data);
      setShowModal(true);
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
      if (socketRef.current) {
        socketRef.current.emit('setAvailability', { available: newStatus });
      }
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
    setShowModal(false);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Ride Request from {rideRequest ? rideRequest.riderName : ''}</Text>
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
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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