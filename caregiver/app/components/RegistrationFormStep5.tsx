import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { saveUserData, getUserData, clearUserData } from '../helpers/storageHelper';

type Props = {
  navigation: any;
};

const careTypes = [
  { label: 'Personal Care', value: 'personal_care', icon: 'user' },
  { label: 'Medical Care', value: 'medkit', icon: 'medkit' },
  { label: 'Companionship & Social', value: 'companionship_social', icon: 'users' },
  { label: 'Household Help', value: 'home', icon: 'home' },
];

const RegistrationFormStep5: React.FC<Props> = ({ navigation }) => {
  const [selectedCareType, setSelectedCareType] = useState<string | null>(null);
  const [passcode, setPasscode] = useState<string[]>(['', '', '', '']);
  const passcodeRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setSelectedCareType(userData.careType || null);
        if (userData.passcode) {
          setPasscode(userData.passcode.split(''));
        }
      }
    };
    loadUserData();
  }, []);

  const handleFinish = async () => {
    if (!selectedCareType) {
      Alert.alert('Error', 'Please select a type of care.');
      return;
    }

    if (passcode.some((digit) => digit === '')) {
      Alert.alert('Error', 'Please enter the full passcode.');
      return;
    }

    const userData = {
      careType: selectedCareType,
      passcode: passcode.join(''),
      registrationComplete: true,
    };

    await saveUserData(userData);
    await clearUserData();

    navigation.navigate('StatusScreen', {
      status: 'success',
      title: 'Account Created!',
      message: 'Your account has been created successfully.',
      duration: 5000,
      onContinue: () => navigation.navigate('Dashboard'), 
    });
  };

  const handlePasscodeChange = (index: number, value: string) => {
    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);
    if (value && index < passcodeRefs.current.length - 1) {
      passcodeRefs.current[index + 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Please select the type of care you are looking for.
          </Text>
          <View style={styles.categoriesContainer}>
            {careTypes.map((care) => (
              <TouchableOpacity
                key={care.value}
                style={[
                  styles.careTypeTag,
                  selectedCareType === care.value && styles.selectedCareTypeTag,
                ]}
                onPress={() => setSelectedCareType(care.value)}
              >
                <Icon
                  name={care.icon}
                  size={32}
                  color={selectedCareType === care.value ? '#fff' : '#295259'}
                  style={styles.careTypeIcon}
                />
                <Text
                  style={[
                    styles.careTypeText,
                    selectedCareType === care.value && styles.selectedCareTypeText,
                  ]}
                >
                  {care.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.instructionText}>Create Passcode</Text>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#C2A27C' }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#295259' }]}
              onPress={handleFinish}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>FINISH</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
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
  instructionText: {
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  careTypeTag: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectedCareTypeTag: {
    backgroundColor: '#295259',
  },
  careTypeIcon: {
    marginBottom: 10,
  },
  careTypeText: {
    color: '#4A4A4A',
    textAlign: 'center',
    fontSize: 16,
  },
  selectedCareTypeText: {
    color: '#fff',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
});

export default RegistrationFormStep5;
