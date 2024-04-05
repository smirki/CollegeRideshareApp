import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    if (!email || !password || !firstName || !lastName || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    fetch(`https://${process.env.EXPO_PUBLIC_API_LOGIN_API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Store the JWT token in AsyncStorage
          AsyncStorage.setItem('token', data.token)
            .then(() => {
              // Navigate to the desired screen after successful signup
              navigation.navigate('DrawerNavigator');
            });
        } else {
          // Handle signup error
          console.log('Signup error:', data.error);
        }
      })
      .catch((error) => {
        // Handle network or other errors
        console.log('Error:', error);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Create Account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#FECC4C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#7e7e7e"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#FECC4C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#7e7e7e"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#FECC4C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7e7e7e"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={24} color="#FECC4C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#7e7e7e"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#FECC4C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7e7e7e"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#FECC4C"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
  },
  showPasswordButton: {
    marginLeft: 10,
  },
  signUpButton: {
    backgroundColor: '#FECC4C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SignUpScreen;