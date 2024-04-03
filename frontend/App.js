import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StripeProvider } from '@stripe/stripe-react-native';

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
import PaymentsScreen from './components/Payments/PaymentsScreen.js';
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
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings';
          }

          //return components here
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FECC4C',
        tabBarInactiveTintColor: '#676767',
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="HomeTabs">
      <Drawer.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ drawerLabel: 'Rider', headerShown: false }}
      />
      <Drawer.Screen
        name="DriverScreen"
        component={DriverTabs}
        options={{ drawerLabel: 'Driver', headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51OfniJDtK57hwiI4CY9u4qzBlNrMLx4n86CmF7hSvmcDFwRJje8noHmnWaw8ESybJHZAXWQPvCBdq0Auu8Ey8lbP00fLL5NXkH" // required for Apple Pay
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* Replace HomeTabs with DrawerNavigator */}
          <Stack.Screen
            name="DrawerNavigator"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />

          {/* Keep other Stack screens as is */}
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}

export default App;

// import * as React from 'react';
// import { StyleSheet, Text, View, Image, Button} from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// //components
// import HomeScreen from './components/Rider/HomeScreen.js';
// import Onboarding from './components/Onboarding/OnboardingScreen.js';
// import ProfileScreen from './components/Rider/ProfileScreen.js';
// import SettingsScreen from './components/Rider/SettingsScreen.js';
// import RideConfirmation  from './components/Rider/RideConfirmation.js';
// import MapScreen from './components/Rider/MapScreen.js'
// import NotificationsScreen from './components/Rider/NotificationScreen.js'
// import DriverScreen from './components/Driver/DriverScreen.js';

// //navigation componenents
// import DriverTabs from './components/Navigation/DriverTabs.js'

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// function HomeTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home';
//           } else if (route.name === 'Notifications') {
//             iconName = focused ? 'notifications' : 'notifications';
//           } else if (route.name === 'Map') {
//             iconName = focused ? 'map' : 'map';
//           } else if (route.name === 'Settings') {
//             iconName = focused ? 'settings' : 'settings';
//           }

//           //return components here
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },"tabBarActiveTintColor": "#FECC4C",
//         "tabBarInactiveTintColor": "#676767",
//         "tabBarStyle": [
//           {
//             "display": "flex"
//           },
//           null
//         ]
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
//       <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}/>
//       <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
//       <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
//     </Tab.Navigator>
//   );
// }

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {/* onboarding screen will be the first route*/}
//         <Stack.Screen
//           name="Onboarding"
//           component={Onboarding}
//           options={{ headerShown: false }}
//         />
//         {/* Once the onboarding is completed, the HomeTabs will be shown */}
//         <Stack.Screen
//           name="HomeTabs"
//           component={HomeTabs}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="RideConfirmation"
//           component={RideConfirmation}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="SettingsScreen"
//           component={SettingsScreen}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="DriverScreen"
//           component={DriverScreen}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//         <Stack.Screen
//           name = "DriverTabs"
//           component = {DriverTabs}
//           options = {{headerShown: false}}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
