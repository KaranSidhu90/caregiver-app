import React from 'react';
import { StyleSheet, View, Image, StatusBar, TouchableOpacity, Text } from 'react-native';

type Props = {
  navigation?: any; 
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Wellnest</Text>
      <Text style={styles.subtitle}>Your Personal In-Home Care Service</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#295259' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#C2A27C' }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.buttonText, { color: '#4A4A4A' }]}>REGISTER</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.caregiverText}>
        Are you a caregiver? <Text style={styles.registerLink} onPress={() => navigation.navigate('CaregiverRegister')}>Register Here!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#4A4A4A',
    fontFamily: 'Poppins-Semibold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 100,
    width: '60%',
    textAlign: 'center',
    color: '#4A4A4A',
    fontFamily: 'Poppins-Light',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 70,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
  },
  caregiverText: {
    fontSize: 14,
    marginTop: 10,
    color: '#0D3B66',
    fontFamily: 'Poppins-Regular',
    position: 'absolute',
    bottom: 80,
    textAlign: 'center',
  },
  registerLink: {
    color: '#295259',
    fontFamily: 'Poppins-Semibold',
  },
});

export default HomeScreen;
