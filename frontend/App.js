import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
// Import screens
import HomeScreen from './components/Rider/HomeScreen.js';
import Onboarding from './components/Onboarding/OnboardingScreen.js';
import ProfileScreen from './components/Rider/ProfileScreen.js';
import SettingsScreen from './components/Rider/SettingsScreen.js';
import RideConfirmation from './components/Rider/RideConfirmation.js';
import MapScreen from './components/Rider/MapScreen.js';
import NotificationsScreen from './components/Rider/NotificationScreen.js';
import DriverScreen from './components/Driver/DriverScreen.js';
import SignupScreen from './components/Onboarding/SignUp.js';
import LoginScreen from './components/Onboarding/LoginScreen.js';
// Import navigation components
import DriverTabs from './components/Navigation/DriverTabs.js';
import ChatScreen from './components/Rider/ChatScreen.js';
import EventHostPage from './components/Host/EventHostPage.js'
import UserEventsPage from './components/Rider/UserEventsPage.js'
import EventsRegistrationPage from './components/Rider/EventsRegistrationPage.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="HomeTabs">
      <Drawer.Screen name="HomeTabs" component={HomeTabs} options={{ drawerLabel: 'Rider', headerShown: false }} />
      <Drawer.Screen name="DriverScreen" component={DriverTabs} options={{ drawerLabel: 'Driver', headerShown: false }} />
      <Drawer.Screen name="EventHostScreen" component={EventHostPage} options={{ drawerLabel: 'Event Host Page', headerShown: false }} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="UserEventsPage" component={UserEventsPage} />
        <Stack.Screen name="EventsRegistrationPage" component={EventsRegistrationPage} options={{ headerShown: false }} />
        <Stack.Screen name="RideConfirmation" component={RideConfirmation} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;