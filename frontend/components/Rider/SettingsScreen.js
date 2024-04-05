import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const AccordionItem = ({ title, children, expanded }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  return (
    <View>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.settingText}>{title}</Text>
        <AntDesign name={isExpanded ? 'up' : 'down'} size={16} color="#34C759" />
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

const SettingsScreen = ({ navigation }) => {
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

  const openURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <AccordionItem title="Account">
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="user" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Profile</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="lock" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Change Password</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <FontAwesome name="credit-card" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Payment Methods</Text>
          <Switch
            value={paymentMethodsEnabled}
            onValueChange={togglePaymentMethods}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={paymentMethodsEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </AccordionItem>

      <AccordionItem title="Preferences">
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={notificationsEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Location Tracking</Text>
          <Switch
            value={locationTrackingEnabled}
            onValueChange={toggleLocationTracking}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={locationTrackingEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="brightness-4" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={darkModeEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <FontAwesome name="map" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Map Preferences</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </View>
      </AccordionItem>

      <AccordionItem title="Security">
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <FontAwesome name="check-square" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Biometric Authentication</Text>
          <Switch
            value={biometricAuthEnabled}
            onValueChange={toggleBiometricAuth}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={biometricAuthEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => openURL('https://www.youruniversity.edu/privacy-policy')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="shield" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Privacy Policy</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => openURL('https://www.youruniversity.edu/terms-of-service')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="file-text-o" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Terms of Service</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="Ride History">
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <FontAwesome name="history" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Save Ride History</Text>
          <Switch
            value={rideHistoryEnabled}
            onValueChange={toggleRideHistory}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={rideHistoryEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('RideHistoryScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="list-alt" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>View Ride History</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="Safety">
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <FontAwesome name="phone" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Emergency Contacts</Text>
          <Switch
            value={emergencyContactsEnabled}
            onValueChange={toggleEmergencyContacts}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={emergencyContactsEnabled ? '#FAFAFA' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('SafetyTipsScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="info-circle" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Safety Tips</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="Support">
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('HelpCenterScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="question-circle" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Help Center</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ContactSupportScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="envelope" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Contact Support</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="About">
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('AboutScreen')}>
          <View style={styles.iconContainer}>
            <FontAwesome name="info-circle" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>About the App</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => openURL('https://www.youruniversity.edu/contact')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="envelope" size={20} color="#34C759" />
          </View>
          <Text style={styles.settingText}>Contact Us</Text>
          <AntDesign name="right" size={16} color="#34C759" />
        </TouchableOpacity>
      </AccordionItem>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignOutScreen')}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#373737',
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
    color: 'white',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#373737',
  },
});

export default SettingsScreen;