import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, FlatList, SafeAreaView, Animated, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode} from 'jwt-decode'; // Updated import

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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    marginHorizontal: 18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 15,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  destinationCard: {
    backgroundColor: 'white',
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
      // replace with actual image source
      justifyContent: 'center',
      alignItems: 'center',
    },
    destinationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    destinationTime: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 8,
    },
    goButtonSmall: {
      backgroundColor: '#ffcc00',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    goButtonTextSmall: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
    },
    goButtonLarge: {
      backgroundColor: '#ffcc00',
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
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      searchInputContainer: {
        flex: 1, 
        marginRight: 10, 
      },
      searchInput: {
        // Style your search input
      },
      filterButton: {
        
        
      },searchBar: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      },
      searchInput: {
        flex: 1,
        paddingHorizontal: 10,
      },
      filterButton: {
        backgroundColor: '#FFCC00',
        borderRadius: 15,
        padding: 10,
      },
      iconWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 5,
      },
      profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25, // Makes it circular
      },
      userName: {
        marginLeft: 10,
        fontWeight: 'bold',
      },
      filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        marginBottom: 0,
      },
      filterTag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        margin: 5,
      },
      activeFilterTag: {
        backgroundColor: '#FECC4C',
        color: 'white',
      },
      filterTagText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    });


  
  

  const HomeScreen = ({ navigation }) => {
    const handlePressGo = (item) => {
      navigation.navigate('Map', {
        initialDestination: {
          latitude: item.latitude,
          longitude: item.longitude,
          label: item.title,
        },
      });
    };
    
  
    const userProfile = {
      name: 'Jane Doe',
      profilePic: 'https://via.placeholder.com/150',
    };
    
  
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
      fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          console.log(decoded);
          // If the token doesn't have the complete user info or it's a newly registered user without a profile picture, set defaults
          const userData = {
            _id: decoded.user_id || 'default_id',
            name: decoded.name || 'User', // Fallback to 'User' if name is not in token
            email: decoded.email || 'user@example.com', // Fallback email
            profilePic: decoded.profilePic || 'https://via.placeholder.com/150', // Placeholder image URL
          };
          setUser(userData);
        } else {
          // Set user to null or default values if there's no token
          setUser({
            _id: 'default_id',
            name: 'User',
            email: 'user@example.com',
            profilePic: 'https://via.placeholder.com/150',
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Fallback user data in case of an error
        setUser({
          _id: 'default_id',
          name: 'User',
          email: 'user@example.com',
          profilePic: 'https://via.placeholder.com/150',
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
      </View>
        <Text style={styles.title}>Find a Driver</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Events..."
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
            {['All', 'Nightlife', 'Grocery', 'Party', 'Frat', 'Venue', 'Bar', 'Brewery'].map(renderFilterTag)}
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