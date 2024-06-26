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
import { Dropdown } from 'react-native-element-dropdown';
import { saveUserData, getUserData } from '../helpers/storageHelper';

type Props = {
  navigation: any;
};

const provinces = [
  { label: 'AB', value: 'AB' },
  { label: 'BC', value: 'BC' },
  { label: 'MB', value: 'MB' },
  { label: 'NB', value: 'NB' },
  { label: 'NL', value: 'NL' },
  { label: 'NS', value: 'NS' },
  { label: 'NT', value: 'NT' },
  { label: 'NU', value: 'NU' },
  { label: 'ON', value: 'ON' },
  { label: 'PE', value: 'PE' },
  { label: 'QC', value: 'QC' },
  { label: 'SK', value: 'SK' },
  { label: 'YT', value: 'YT' },
];

const RegistrationFormStep2: React.FC<Props> = ({ navigation }) => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const addressLine1InputRef = useRef<TextInput>(null);
  const addressLine2InputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const zipCodeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setAddressLine1(userData.addressLine1 || '');
        setAddressLine2(userData.addressLine2 || '');
        setCity(userData.city || '');
        setState(userData.state || '');
        setZipCode(userData.zipCode || '');
      }
    };
    loadUserData();
  }, []);

  const handleNext = async () => {
    if (!addressLine1 || !city || !province || !zipCode) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const userData = {
      addressLine1,
      addressLine2,
      city,
      state: province,
      zipCode,
    };

    await saveUserData(userData);

    navigation.navigate('RegistrationStep3');
  };

  const handleSaveAndContinueLater = async () => {
    const userData = {
      addressLine1,
      addressLine2,
      city,
      state: province,
      zipCode,
    };

    await saveUserData(userData);

    Alert.alert('Saved', 'Your data has been saved. You can continue later.');
  };

  const handleZipCodeChange = (text: string) => {
    const formattedText = text
      .replace(/[^A-Za-z0-9]/g, '') 
      .replace(/(\w{3})(\w{3})/, '$1 $2'); 

    setZipCode(formattedText);
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Address Line 1<Text style={styles.required}> *</Text></Text>
            <TextInput
              placeholder="Enter your street address"
              value={addressLine1}
              style={styles.input}
              onChangeText={setAddressLine1}
              returnKeyType="next"
              ref={addressLine1InputRef}
              onSubmitEditing={() => addressLine2InputRef.current?.focus()}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              placeholder="Enter your house number"
              value={addressLine2}
              style={styles.input}
              onChangeText={setAddressLine2}
              returnKeyType="next"
              ref={addressLine2InputRef}
              onSubmitEditing={() => cityInputRef.current?.focus()}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, styles.cityContainer]}>
              <Text style={styles.label}>City<Text style={styles.required}> *</Text></Text>
              <TextInput
                placeholder="Enter your city"
                value={city}
                style={styles.input}
                onChangeText={setCity}
                returnKeyType="next"
                ref={cityInputRef}
                onSubmitEditing={() => zipCodeInputRef.current?.focus()}
              />
            </View>

            <View style={[styles.fieldContainer, styles.stateContainer]}>
              <Text style={styles.label}>Province<Text style={styles.required}> *</Text></Text>
              <Dropdown
                style={styles.input}
                containerStyle={styles.dropdownContainer}
                data={provinces}
                labelField="label"
                valueField="value"
                placeholder="Select"
                value={province}
                onChange={(item) => {
                  setState(item.value);
                  zipCodeInputRef.current?.focus();
                }}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Zip Code<Text style={styles.required}> *</Text></Text>
            <TextInput
              placeholder="Enter your zip code"
              value={zipCode}
              style={styles.input}
              onChangeText={handleZipCodeChange}
              returnKeyType="done"
              ref={zipCodeInputRef}
              maxLength={7} 
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#C2A27C' }]} onPress={() => navigation.goBack()}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#295259' }]} onPress={handleNext}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>NEXT</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinueLater}>
            <Text style={styles.saveButtonText}>SAVE & CONTINUE LATER</Text>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityContainer: {
    flex: 2,
    marginRight: 10,
  },
  stateContainer: {
    flex: 1,
  },
  dropdownContainer: {
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
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
  saveButton: {
    backgroundColor: '#888',
    borderRadius: 35,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});

export default RegistrationFormStep2;
