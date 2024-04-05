import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, FlatList, SafeAreaView, Animated, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode} from 'jwt-decode'; // Updated import
import { ObjectId } from 'bson';

// Dummy data for the flat list
const data = [
  { key: '1', title: 'AvidXchange Music Factory', time: '9 PM EST', backgroundColor: '#EBF8EE', category: 'Nightlife', latitude: 35.2401, longitude: -80.8451 },
  { key: '2', title: 'Bojangles Coliseum', time: '8 PM EST', backgroundColor: '#FD4E26', category: 'Nightlife', latitude: 35.2079, longitude: -80.7997 },
  { key: '3', title: 'Ink n Ivy', time: '10 PM EST', backgroundColor: '#EBF8EE', latitude: 35.2274, longitude: -80.8443 },
  { key: '4', title: 'Merchant & Trade', time: '7 PM EST', backgroundColor: '#FD4E26', latitude: 35.2279, longitude: -80.8433 },
  { key: '5', title: 'Middle C Jazz', time: '6 PM EST', backgroundColor: '#EBF8EE', latitude: 35.2215, longitude: -80.8457 },
  { key: '6', title: 'Nuvole Rooftop TwentyTwo', time: '8 PM EST', backgroundColor: '#FD4E26', latitude: 35.2278, longitude: -80.8431 },
  { key: '7', title: 'Ovens Auditorium', time: '9 PM EST', backgroundColor: '#EBF8EE', latitude: 35.2083, longitude: -80.7934 },
  { key: '8', title: 'Petra\'s', time: '10 PM EST', backgroundColor: '#FD4E26', latitude: 35.2204, longitude: -80.8128 },
  { key: '9', title: 'Pinhouse', time: '11 AM EST', backgroundColor: '#EBF8EE', latitude: 35.2099, longitude: -80.8126 },
  { key: '10', title: 'PNC Music Pavilion', time: '8 PM EST', backgroundColor: '#FD4E26', latitude: 35.3354, longitude: -80.7328 },
  { key: '10', title: 'PNC Music Pavilion', time: '8 PM EST', backgroundColor: '#FD4E26' },
  { key: '11', title: 'Puttery', time: '7 PM EST', backgroundColor: '#EBF8EE' },
  { key: '12', title: 'Skyla Credit Union Amphitheatre', time: '9 PM EST', backgroundColor: '#FD4E26' },
  { key: '13', title: 'Society at 229', time: '10 PM EST', backgroundColor: '#EBF8EE' },
  { key: '14', title: 'Spectrum Center', time: '8 PM EST', backgroundColor: '#FD4E26' },
  { key: '15', title: 'SupperClub', time: '11 PM EST', backgroundColor: '#EBF8EE' },
  { key: '16', title: 'The Amp Ballantyne', time: '9 PM EST', backgroundColor: '#FD4E26' },
  { key: '17', title: 'The Comedy Zone', time: '8 PM EST', backgroundColor: '#EBF8EE' },
  { key: '18', title: 'The Fillmore', time: '10 PM EST', backgroundColor: '#FD4E26' },
  { key: '19', title: 'The Underground', time: '9 PM EST', backgroundColor: '#EBF8EE' },
  { key: '20', title: 'The Union at Station West', time: '8 PM EST', backgroundColor: '#FD4E26' },
  // Adding fictional grocery stores with random times
  { key: '21', title: 'Charlotte Grocery Store A', time: 'Open 24 Hours', backgroundColor: '#B2EBF2', category: 'Grocery' },
  { key: '22', title: 'Charlotte Grocery Store B', time: '6 AM - 11 PM EST', backgroundColor: '#B2EBF2', category: 'Grocery' },
  { key: '23', title: 'Charlotte Grocery Store C', time: '7 AM - 10 PM EST', backgroundColor: '#B2EBF2' },
  { key: '24', title: 'Charlotte Grocery Store D', time: '5 AM - Midnight EST', backgroundColor: '#B2EBF2' },
  // ... add more venues and grocery stores as needed
]; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'white',
  },
  filterButton: {
    backgroundColor: '#424242',
    borderRadius: 10,
    padding: 10,
  },
  sectionHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  destinationCard: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    width: '48%',
  },
  destinationImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  destinationTime: {
    color: '#7e7e7e',
    fontSize: 14,
    marginBottom: 8,
  },
  goButtonSmall: {
    backgroundColor: '#424242',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  goButtonTextSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goButtonLarge: {
    backgroundColor: '#424242',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonTextLarge: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  filterTag: {
    backgroundColor: '#232323',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
  },
  activeFilterTag: {
    backgroundColor: '#424242',
  },
  filterTagText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  myEventsButton: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  myEventsButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  destinationPrice: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  destinationTickets: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
});


  
  

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUserInfo();
    fetchDestinationsAndEvents();
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

  const fetchDestinationsAndEvents = async () => {
    try {
      const response = await fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/tickets/destinations-and-events`);
      const responseData = await response.json();
      if (response.ok) {
        setData(responseData.data);
      } else {
        throw new Error(responseData.error);
      }
    } catch (error) {
      console.error('Error fetching destinations and events:', error);
    }
  };

  const handlePressGo = (item) => {
    if (item.category === 'Event') {
      console.log(item._id);
      navigation.navigate('EventsRegistrationPage', { eventId: item._id });
    } else {
      navigation.navigate('Map', {
        initialDestination: {
          latitude: item.latitude,
          longitude: item.longitude,
          label: item.title,
        },
      });
    }
  };

  const filteredData = data.filter((item) => activeCategory === 'All' || item.category === activeCategory);

  const renderDestination = ({ item }) => (
    <View style={styles.destinationCard}>
      <View style={[styles.destinationImage, { backgroundColor: item.backgroundColor }]}>
        {/* Replace with Image component if necessary */}
      </View>
      <Text style={styles.destinationTitle}>{item.title}</Text>
      <Text style={styles.destinationTime}>{item.time}</Text>
      {item.category === 'Event' && (
        <>
          <Text style={styles.destinationPrice}>Price: ${item.ticketPrice}</Text>
          <Text style={styles.destinationTickets}>Available Tickets: {item.numberOfTickets - item.ticketsSold}</Text>
        </>
      )}
      <TouchableOpacity style={styles.goButtonSmall} onPress={() => handlePressGo(item)}>
        <Text style={styles.goButtonTextSmall}>GO</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterTag = (category) => (
    <TouchableOpacity
      key={category}
      style={[styles.filterTag, activeCategory === category && styles.activeFilterTag]}
      onPress={() => setActiveCategory(category)}
    >
      <Text style={styles.filterTagText}>{category}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        {user ? (
          <>
            <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
            <Text style={styles.userName}>{user.name}</Text>
          </>
        ) : (
          <Text style={styles.userName}>Loading user...</Text>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('UserEventsPage')} style={styles.myEventsButton}>
          <FontAwesome5 name="calendar-alt" size={24} color="white" />
          <Text style={styles.myEventsButtonText}>My Events</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Find a Driver</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Events..."
          placeholderTextColor="#7e7e7e"
          onChangeText={setSearch}
          value={search}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => {}}>
          <Ionicons name="options" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionHeader}>Popular Destinations</Text>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Nightlife', 'Grocery', 'Party', 'Frat', 'Venue', 'Bar', 'Brewery', 'Event'].map(renderFilterTag)}
        </ScrollView>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderDestination}
        keyExtractor={(item) => item.key}
        numColumns={2}
        nestedScrollEnabled
      />
      <TouchableOpacity style={styles.goButtonLarge} onPress={() => navigation.navigate('RideConfirmation')}>
        <Text style={styles.goButtonTextLarge}>GO</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
  export default HomeScreen;