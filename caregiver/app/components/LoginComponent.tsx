import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import RegistrationHeader from './RegistrationHeader';

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

  const handleLogin = () => {
    const phoneNumber = phoneInputRef.current?.getValue() || '';
    const passcodeString = passcode.join('');

    if (phoneNumber === '+13065816969' && passcodeString === '1234') {
      navigation.navigate('HomeInternal');
    } else {
      Alert.alert('Error', 'Invalid phone number or passcode.');
    }
  };

  return (
    
    <View style={styles.container}>
    <RegistrationHeader title="LOGIN" step="" icon="hands" />
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
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
});

export default LoginComponent;
