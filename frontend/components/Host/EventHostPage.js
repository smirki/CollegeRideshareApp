import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode} from 'jwt-decode'; // Updated import
import AsyncStorage from '@react-native-async-storage/async-storage';

import DateTimePicker from '@react-native-community/datetimepicker';

const EventCard = ({ event, onUpdate }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{event.name}</Text>
      <Text style={styles.cardText}>Date: {event.date}</Text>
      <Text style={styles.cardText}>Ticket Price: ${event.ticketPrice.toFixed(2)}</Text>
      <Text style={styles.cardText}>Number of Tickets: {event.numberOfTickets}</Text>
      <TouchableOpacity style={styles.updateButton} onPress={() => onUpdate(event)}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const EventHostPage = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [ticketPrice, setTicketPrice] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState('');
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [eventPassword, setEventPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  

  useEffect(() => {
    fetchUserInfo();
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

  const handleCreateEvent = async () => {
    const eventDetails = {
      name: eventName,
      date: eventDate,
      ticketPrice: parseFloat(ticketPrice),
      numberOfTickets: parseInt(numberOfTickets),
      password: eventPassword, // Add the password field
    };

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/create-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventDetails),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Event created successfully!');
          setEvents([...events, data.event]);
          resetForm();
        } else {
          alert('Failed to create event.');
        }
      } else {
        const errorText = await response.text();
        console.error('Error creating event:', errorText);
        alert('Error creating event. Please try again.');
      }
    } catch (error) {
      const errorText = await response.text();
      console.error('Error creating event:', errorText);
      alert('Error creating event. Please try again.');
    }
  };

  const handleUpdateEvent = async (updatedEvent) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/update-event`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      const data = await response.json();
      if (data.success) {
        alert('Event updated successfully!');
        const updatedEvents = events.map((event) => (event._id === updatedEvent._id ? updatedEvent : event));
        setEvents(updatedEvents);
      } else {
        alert('Failed to update event.');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event.');
    }
  };

  const resetForm = () => {
    setEventName('');
    setEventDate('');
    setTicketPrice('');
    setNumberOfTickets('');
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setEventDate(selectedDate.toISOString().split('T')[0]);
    }
    setShowDatePicker(false);
  };

  const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Create New Event</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {eventDate || 'Select Event Date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && isValidDate(eventDate) && (
  <DateTimePicker
    value={new Date(eventDate)}
    mode="date"
    display="default"
    onChange={handleDateChange}
  />
)}
        <TextInput
          style={styles.input}
          placeholder="Ticket Price ($)"
          value={ticketPrice}
          onChangeText={setTicketPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Tickets"
          value={numberOfTickets}
          onChangeText={setNumberOfTickets}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Event Password"
          value={eventPassword}
          onChangeText={setEventPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.eventsContainer}>
        {events.map((event) => (
          <EventCard key={event._id} event={event} onUpdate={handleUpdateEvent} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  formContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#232323',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventsContainer: {
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  datePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default EventHostPage;