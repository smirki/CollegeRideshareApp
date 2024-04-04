import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Switch, ScrollView } from 'react-native';
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const AccordionItem = ({ title, children, expanded }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  return (
    <View>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.settingText}>{title}</Text>
        <AntDesign name={isExpanded ? 'up' : 'down'} size={16} color="#FFFFFF" />
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricAuthEnabled, setBiometricAuthEnabled] = useState(false);
  const [rideHistoryEnabled, setRideHistoryEnabled] = useState(true);
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] = useState(false);
  const [paymentMethodsEnabled, setPaymentMethodsEnabled] = useState(true);

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleLocationTracking = () => setLocationTrackingEnabled(!locationTrackingEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);
  const toggleBiometricAuth = () => setBiometricAuthEnabled(!biometricAuthEnabled);
  const toggleRideHistory = () => setRideHistoryEnabled(!rideHistoryEnabled);
  const toggleEmergencyContacts = () => setEmergencyContactsEnabled(!emergencyContactsEnabled);
  const togglePaymentMethods = () => setPaymentMethodsEnabled(!paymentMethodsEnabled);

  const handleVerification = () => {
    // Implement verification logic here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.header}>Fill out your profile</Text>
        <Text style={styles.subHeader}>To ensure the safety of everyone on this platform</Text>
        <View style={styles.avatarContainer}>
          {/* Placeholder for avatar, implement image picker if needed */}
          <Image style={styles.avatar} source={require('../../assets/favicon.png')} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#7e7e7e"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#7e7e7e"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nickname (shown to drivers)"
          placeholderTextColor="#7e7e7e"
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#7e7e7e"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#7e7e7e"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact"
          placeholderTextColor="#7e7e7e"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
        />
        {/* Implement driver's license upload feature */}
        <TouchableOpacity style={styles.verificationButton} onPress={handleVerification}>
          <Text style={styles.verificationButtonText}>Get Verified</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.header}>Settings</Text>

        <AccordionItem title="Account">
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <FontAwesome name="credit-card" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Payment Methods</Text>
            <Switch
              value={paymentMethodsEnabled}
              onValueChange={togglePaymentMethods}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={paymentMethodsEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </AccordionItem>

        <AccordionItem title="Preferences">
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Location Tracking</Text>
            <Switch
              value={locationTrackingEnabled}
              onValueChange={toggleLocationTracking}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={locationTrackingEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="brightness-4" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={darkModeEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <FontAwesome name="map" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Map Preferences</Text>
            <AntDesign name="right" size={16} color="#FFFFFF" />
          </View>
        </AccordionItem>

        <AccordionItem title="Security">
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <FontAwesome name="check-square" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Biometric Authentication</Text>
            <Switch
              value={biometricAuthEnabled}
              onValueChange={toggleBiometricAuth}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={biometricAuthEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </AccordionItem>

        <AccordionItem title="Ride History">
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <FontAwesome name="history" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Save Ride History</Text>
            <Switch
              value={rideHistoryEnabled}
              onValueChange={toggleRideHistory}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={rideHistoryEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </AccordionItem>

        <AccordionItem title="Safety">
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <FontAwesome name="phone" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Emergency Contacts</Text>
            <Switch
              value={emergencyContactsEnabled}
              onValueChange={toggleEmergencyContacts}
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={emergencyContactsEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </AccordionItem>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#232323',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  subHeader: {
    fontSize: 16,
    color: '#7e7e7e',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  verificationButton: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  verificationButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#232323',
  },
  iconContainer: {
    backgroundColor: '#232323',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#232323',
  },
});

export default ProfileScreen;