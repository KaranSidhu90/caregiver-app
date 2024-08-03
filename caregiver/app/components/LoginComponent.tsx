import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import RegistrationHeader from './RegistrationHeader';
import API_ENDPOINTS from '../../config/apiEndpoints';
import axios from 'axios';
import { setAuthToken } from '../../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
};

const LoginComponent: React.FC<Props> = ({ navigation }) => {
  const [passcode, setPasscode] = useState<string[]>(['', '', '', '']);
  const passcodeRefs = useRef<(TextInput | null)[]>([]);
  const phoneInputRef = useRef<PhoneInput>(null);

  const handlePasscodeChange = (index: number, value: string) => {
    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);
    if (value && index < passcodeRefs.current.length - 1) {
      passcodeRefs.current[index + 1]?.focus();
    }
  };

  const handlePasscodeKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && passcode[index] === '' && index > 0) {
      passcodeRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async () => {
    const phoneNumber = phoneInputRef.current?.getValue() || '';
    const passcodeString = passcode.join('');

    if (!phoneInputRef.current?.isValidNumber()) {
      Alert.alert('Error', 'Invalid phone number.');
      return;
    }

    try {
      await AsyncStorage.clear();

      const loginPayload = {
        phoneNumber,
        passcode: passcodeString,
      };

      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, loginPayload);
      if (response.status === 200) {
        const { token, email, name, id } = response.data;
        await setAuthToken(token);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userName', name);
        await AsyncStorage.setItem('userId', id);
        navigation.navigate('AfterAuth');
      } else {
        Alert.alert('Error', 'Invalid phone number or passcode.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', `Login failed: ${error.response.data.message}`);
      } else {
        Alert.alert('Error', `Login failed. Please try again. ${error}`);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <RegistrationHeader title="LOGIN" step="" icon="hands" />
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewContent}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
          extraScrollHeight={20}
        >
          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                ref={phoneInputRef}
                initialCountry="ca"
                autoFormat={true}
                textProps={{
                  placeholder: "Enter your phone number",
                  keyboardType: "phone-pad",
                  returnKeyType: "next",
                  style: styles.input,
                  maxLength: 15,
                }}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Passcode</Text>
              <View style={styles.passcodeContainer}>
                {passcode.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.passcodeInput}
                    value={digit}
                    onChangeText={(value) => handlePasscodeChange(index, value)}
                    onKeyPress={({ nativeEvent }) => handlePasscodeKeyPress(index, nativeEvent.key)}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={(ref) => (passcodeRefs.current[index] = ref)}
                  />
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerLink}>Register Here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    margin: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  passcodeInput: {
    width: '20%',
    height: 50,
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
  },
  button: {
    backgroundColor: '#295259',
    borderRadius: 35,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  registerText: {
    fontSize: 14,
    color: '#4A4A4A',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  registerLink: {
    color: '#295259',
    fontFamily: 'Poppins-Medium',
  },
});

export default LoginComponent;
