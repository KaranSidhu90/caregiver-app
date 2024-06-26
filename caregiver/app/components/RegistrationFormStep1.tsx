import React, { useState, useEffect, useRef } from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { saveUserData, getUserData, clearUserData } from '../helpers/storageHelper';

type Props = {
  navigation: any;
};

const RegistrationFormStep1: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const phoneNumberInputRef = useRef<PhoneInput>(null);
  const dateOfBirthInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setName(userData.name || '');
        setPhoneNumber(userData.phoneNumber || '');
        setDateOfBirth(userData.dateOfBirth ? new Date(userData.dateOfBirth) : null);
        setSelectedGender(userData.gender || '');
        if (phoneNumberInputRef.current) {
          phoneNumberInputRef.current.setValue(userData.phoneNumber || '');
        }
      }
    };
    loadUserData();
  }, []);

  const handleConfirm = (selectedDate: Date) => {
    setDateOfBirth(selectedDate);
    setDatePickerVisibility(false);
  };

  const handleNext = async () => {
    if (!name || !phoneNumber || !dateOfBirth || !selectedGender) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const userData = {
      name,
      phoneNumber,
      dateOfBirth,
      gender: selectedGender,
    };

    await saveUserData(userData);

    navigation.navigate('RegistrationStep2');
  };

  const handleClearStorage = async () => {
    await clearUserData();
    Alert.alert('Cleared', 'All data has been cleared from async storage.');
    setName('');
    setPhoneNumber('');
    setDateOfBirth(null);
    setSelectedGender('');
    if (phoneNumberInputRef.current) {
      phoneNumberInputRef.current.setValue('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>What's your name?<Text style={styles.required}> *</Text></Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              style={styles.input}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => phoneNumberInputRef.current?.focus()}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>What's your Phone Number?<Text style={styles.required}> *</Text></Text>
            <PhoneInput
              ref={phoneNumberInputRef}
              initialCountry="ca"
              autoFormat={true}
              onChangePhoneNumber={setPhoneNumber}
              textProps={{
                placeholder: "Enter your phone number",
                keyboardType: "phone-pad",
                returnKeyType: "next",
                onSubmitEditing: () => dateOfBirthInputRef.current?.focus(),
                style: styles.input,
                maxLength: 15, 
              }}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>What's your Date of Birth?<Text style={styles.required}> *</Text></Text>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.fullInputContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter your date of birth"
                  value={dateOfBirth ? moment(dateOfBirth).format('MMM DD YYYY') : ''}
                  style={styles.dateInput}
                  editable={false}
                  ref={dateOfBirthInputRef}
                />
                <Icon name="calendar" size={20} style={styles.icon} />
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              display="spinner"
              date={dateOfBirth || new Date()}
              textColor='#295259'
              onConfirm={handleConfirm}
              onCancel={() => setDatePickerVisibility(false)}
              maximumDate={new Date()}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Gender<Text style={styles.required}> *</Text></Text>
            <View style={styles.radioContainer}>
              {['Male', 'Female', 'Other'].map(gender => (
                <TouchableOpacity
                  key={gender}
                  style={[styles.radioTag, selectedGender === gender && styles.selectedRadioTag]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text style={[styles.radioText, selectedGender === gender && styles.selectedRadioText]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#C2A27C' }]} onPress={() => navigation.goBack()}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#295259' }]} onPress={handleNext}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>NEXT</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#888', marginTop: 10 }]} onPress={handleClearStorage}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>CLEAR STORAGE</Text>
          </TouchableOpacity>
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
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 5,
    fontSize: 16,
  },
  required: {
    color: 'red',
  },
  input: {
    height: 50,
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  fullInputContainer: {
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#4A4A4A',
  },
  icon: {
    marginLeft: 10,
    color: '#295259',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioTag: {
    borderWidth: 2,
    borderColor: '#295259',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  selectedRadioTag: {
    backgroundColor: '#295259',
  },
  radioText: {
    color: '#4A4A4A',
    fontSize: 16,
  },
  selectedRadioText: {
    color: '#fff',
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
  phoneInput: {
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 50,
    marginTop: 10,
  },
});

export default RegistrationFormStep1;
