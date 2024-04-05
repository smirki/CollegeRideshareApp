import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventRegistrationPage = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/event/${eventId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setEvent(data.event);
        } else {
          throw new Error(data.error);
        }
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to fetch event details.');
    }
  };
  

  const handleRegister = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/register-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: eventId }),
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Success', 'Registered for the event successfully');
          navigation.goBack();
        } else {
          throw new Error(data.error);
        }
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error registering for the event:', error);
      Alert.alert('Error', 'Failed to register for the event.');
    }
  };
  

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.price}>Ticket Price: ${event.ticketPrice}</Text>
      <Text style={styles.tickets}>Available Tickets: {event.numberOfTickets - event.ticketsSold}</Text>
      <Text style={styles.host}>Hosted by: {event.host}</Text>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  tickets: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  host: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#424242',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EventRegistrationPage;