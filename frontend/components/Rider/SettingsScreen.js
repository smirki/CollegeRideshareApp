import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Ensure you have expo/vector-icons installed

const AccordionItem = ({ title, children, expanded }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  return (
    <View>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.settingText}>{title}</Text>
        <AntDesign name={isExpanded ? 'up' : 'down'} size={16} color="black" />
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

const SettingsScreen = ({navigation}) => {
  // Example of individual state for different settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Toggle functions for each setting
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleLocationTracking = () => setLocationTrackingEnabled(!locationTrackingEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);

  // Function to open URLs for privacy policy and terms of service
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="Preferences">
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Location Tracking</Text>
          <Switch value={locationTrackingEnabled} onValueChange={toggleLocationTracking} />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={darkModeEnabled} onValueChange={toggleDarkMode} />
        </View>
      </AccordionItem>

      <AccordionItem title="Privacy">
        <TouchableOpacity
          style={styles.button}
          onPress={() => openURL('https://www.youruniversity.edu/privacy-policy')}
        >
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openURL('https://www.youruniversity.edu/terms-of-service')}
        >
          <Text style={styles.buttonText}>Terms of Service</Text>
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="About">
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AboutScreen')}
        >
          <Text style={styles.buttonText}>About the App</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openURL('https://www.youruniversity.edu/contact')}
        >
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
      </AccordionItem>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PaymentsScreen')}
      >
        <Text style={styles.buttonText}>Payments</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.openDrawer()}
>
  <Text style={styles.buttonText}>Open Drawer</Text>
</TouchableOpacity>


      {/* Additional settings options */}
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    color: 'black',
  },
  button: {
    backgroundColor: '#FFCC00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
});

export default SettingsScreen;
