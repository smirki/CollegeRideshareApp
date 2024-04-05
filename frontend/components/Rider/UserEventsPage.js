import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode} from 'jwt-decode';

const UserEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({
    _id: 'default_id',
    name: 'User',
    email: 'user@example.com',
    profilePic: 'https://via.placeholder.com/150',
  });

  useEffect(() => {
    fetchUserInfo();
    fetchUserEvents();
  }, []);

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
      } else {
        setUser({
          _id: 'default_id',
          name: 'User',
          email: 'user@example.com',
          profilePic: 'https://via.placeholder.com/150',
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser({
        _id: 'default_id',
        name: 'User',
        email: 'user@example.com',
        profilePic: 'https://via.placeholder.com/150',
      });
    }
  };

  const fetchUserEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/user-events`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Id': decoded.user_id,
            'User-Name': decoded.name,
            'User-Email': decoded.email,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setEvents(data.events);
        } else {
          throw new Error(data.error);
        }
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
      Alert.alert('Error', 'Failed to fetch events.');
    }
  };

  const handleCheckIn = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const checkInUrl = `https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/check-in/${eventId}`;
        Alert.alert('Check-In URL', checkInUrl);
        // You can use the checkInUrl to generate a QR code here
        fetchUserEvents(); // Refresh the event list
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'Failed to check in.');
    }
  };
  

  const handleUnregister = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/unregister-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Success', data.message);
          fetchUserEvents(); // Refresh the event list
        } else {
          throw new Error(data.error);
        }
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error unregistering:', error);
      Alert.alert('Error', 'Failed to unregister.');
    }
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleCheckIn(item._id)}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.unregisterButton]} onPress={() => handleUnregister(item._id)}>
          <Text style={styles.buttonText}>Unregister</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Welcome, {user.name}!</Text>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.eventsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  eventsContainer: {
    paddingBottom: 20,
  },
  eventItem: {
    backgroundColor: '#232323',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventDate: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  unregisterButton: {
    backgroundColor: '#FF6347', // Tomato color for the unregister button
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserEventsPage;