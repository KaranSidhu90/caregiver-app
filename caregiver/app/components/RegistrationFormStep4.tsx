import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { saveUserData, getUserData } from '../helpers/storageHelper';

type Props = {
  navigation: any;
};

const conditions = [
  'Diabetes - Type 2', 'Hypothyroidism', 'Celiac', 'Hyperlipidemia', 
  'Osteoporosis', 'Mobility Impairment', 'Tendonitis', 
];

const RegistrationFormStep4: React.FC<Props> = ({ navigation }) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData && userData.healthConditions) {
        setSelectedConditions(userData.healthConditions);
      }
    };
    loadUserData();
  }, []);

  const filteredConditions = conditions.filter(condition =>
    condition.toLowerCase().includes(filter.toLowerCase()) && !selectedConditions.includes(condition)
  );

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prevSelected) =>
      prevSelected.includes(condition)
        ? prevSelected.filter(item => item !== condition)
        : [...prevSelected, condition]
    );
    setFilter('');
  };

  const handleNext = async () => {
    if (selectedConditions.length === 0) {
      Alert.alert('Error', 'Please select at least one condition.');
      return;
    }

    const userData = {
      healthConditions: selectedConditions,
    };

    await saveUserData(userData);

    navigation.navigate('RegistrationStep5');
  };

  const handleSaveAndContinueLater = async () => {
    const userData = {
      healthConditions: selectedConditions,
    };

    await saveUserData(userData);

    Alert.alert('Saved', 'Your data has been saved. You can continue later.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={filter ? styles.formContainerFiltered : styles.formContainer}>
            <Text style={styles.instructionText}>
              Please select the health conditions that apply to you.
            </Text>
            <TextInput
              placeholder="Type to filter your condition"
              value={filter}
              onChangeText={setFilter}
              style={styles.input}
            />
            <View style={styles.listContainer}>
              <FlatList
                data={filter ? filteredConditions : [...selectedConditions, ...filteredConditions]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.conditionItem,
                      selectedConditions.includes(item) && styles.selectedConditionItem,
                    ]}
                    onPress={() => toggleCondition(item)}
                  >
                    <Text
                      style={[
                        styles.conditionText,
                        selectedConditions.includes(item) && styles.selectedConditionText,
                      ]}
                    >
                      {item}
                    </Text>
                    {selectedConditions.includes(item) && (
                      <Icon name="check-circle" size={20} color="#295259" style={styles.icon} />
                    )}
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="always"
              />
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
                onPress={handleNext}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>NEXT</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinueLater}>
              <Text style={styles.saveButtonText}>SAVE & CONTINUE LATER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    margin: 10,
  },
  formContainerFiltered: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    margin: 10,
    justifyContent: 'flex-start',
    marginTop: 50,
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 20,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    maxHeight: 300,
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    padding: 10,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  selectedConditionItem: {
    // backgroundColor: '#295259',
  },
  conditionText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  selectedConditionText: {
    color: '#295259',
  },
  icon: {
    marginLeft: 10,
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

export default RegistrationFormStep4;
