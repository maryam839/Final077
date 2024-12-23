import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [preferences, setPreferences] = useState({
    notifications: true,
    language: 'English',
  });

  const handleSaveProfile = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
    console.log({
      name,
      address,
      paymentDetails,
      preferences,
    });
  };

  const toggleNotifications = () => {
    setPreferences(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Street"
        value={address.street}
        onChangeText={text => setAddress(prev => ({ ...prev, street: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={address.city}
        onChangeText={text => setAddress(prev => ({ ...prev, city: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={address.state}
        onChangeText={text => setAddress(prev => ({ ...prev, state: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Zip Code"
        keyboardType="numeric"
        value={address.zip}
        onChangeText={text => setAddress(prev => ({ ...prev, zip: text }))}
      />

      {/* Payment Details */}
      <Text style={styles.label}>Payment Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        value={paymentDetails.cardNumber}
        onChangeText={text => setPaymentDetails(prev => ({ ...prev, cardNumber: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (MM/YY)"
        value={paymentDetails.expiryDate}
        onChangeText={text => setPaymentDetails(prev => ({ ...prev, expiryDate: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        keyboardType="numeric"
        value={paymentDetails.cvv}
        onChangeText={text => setPaymentDetails(prev => ({ ...prev, cvv: text }))}
      />

      {/* Preferences */}
      <Text style={styles.label}>Preferences</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleNotifications}>
        <Text style={styles.toggleButtonText}>
          Notifications: {preferences.notifications ? 'Enabled' : 'Disabled'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Preferred Language"
        value={preferences.language}
        onChangeText={text => setPreferences(prev => ({ ...prev, language: text }))}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
    marginBottom: 15,
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ProfileSetup;
