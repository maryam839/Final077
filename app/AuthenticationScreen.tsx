import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, Firestore } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');

  // Email Registration
  const registerWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      await saveUserToFirestore(userCredential.user);
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('ProductPage'); 
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Email Login
  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('ProductPage'); 
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Send Phone Verification Code
  const sendPhoneVerificationCode = async () => {
    try {
      if (!phoneNumber.startsWith('+')) {
        Alert.alert('Error', 'Phone number must be in E.164 format (e.g., +11234567890)');
        return;
      }
      const confirmation = await signInWithPhoneNumber(FIREBASE_AUTH, phoneNumber);
      setVerificationId(confirmation.verificationId);
      Alert.alert('Success', 'Verification code sent!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Verify Phone Code
  const verifyPhoneCode = async () => {
    try {
      if (!verificationId) {
        Alert.alert('Error', 'No verification ID found');
        return;
      }
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(FIREBASE_AUTH, credential);
      await saveUserToFirestore(userCredential.user);
      Alert.alert('Success', 'Phone number verified!');
      navigation.navigate('ProductPage'); 
    } catch (error: any) {
      console.error('Error verifying phone code:', error);
      Alert.alert('Error', error.message);
    }
  };

  // Save User to Firestore
  const saveUserToFirestore = async (user: any) => {
    try {
      const userDocRef = doc(Firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        createdAt: new Date(),
      });
    } catch (error: any) {
      console.error('Error saving user to Firestore:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email Registration/Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Register with Email" onPress={registerWithEmail} />
      <Button title="Login with Email" onPress={loginWithEmail} />

      <Text>Phone Authentication</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., +11234567890)"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />
      <Button title="Send Code" onPress={sendPhoneVerificationCode} />
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        onChangeText={setVerificationCode}
        value={verificationCode}
      />
      <Button title="Verify Phone Code" onPress={verifyPhoneCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});

export default AuthScreen;
