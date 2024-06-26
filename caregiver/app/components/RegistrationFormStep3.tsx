import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { saveUserData, getUserData } from '../helpers/storageHelper';

type Props = {
  navigation: any;
};

const RegistrationFormStep3: React.FC<Props> = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { label: 'Heart & Circulation', value: 'heart_circulation', icon: 'heartbeat' },
    { label: 'Diabetes & Metabolism', value: 'diabetes_metabolism', icon: 'tint' },
    { label: 'Mobility & Pain', value: 'mobility_pain', icon: 'wheelchair' },
    { label: 'Breathing & Sleep', value: 'breathing_sleep', icon: 'bed' },
    { label: 'Mind & Memory', value: 'mind_memory', icon: 'brain' },
    { label: 'Allergies & Digestion', value: 'allergies_digestion', icon: 'apple-alt' },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData && userData.healthCategories) {
        setSelectedCategories(userData.healthCategories);
      }
    };
    loadUserData();
  }, []);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((category) => category !== value)
        : [...prevCategories, value]
    );
  };

  const handleNext = async () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category.');
      return;
    }

    const userData = {
      healthCategories: selectedCategories,
    };

    await saveUserData(userData);

    navigation.navigate('RegistrationStep4');
  };

  const handleSaveAndContinueLater = async () => {
    const userData = {
      healthCategories: selectedCategories,
    };

    await saveUserData(userData);

    Alert.alert('Saved', 'Your data has been saved. You can continue later.');
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Please select health categories that apply to you. You can choose more than one.
          </Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryTag,
                  selectedCategories.includes(category.value) && styles.selectedCategoryTag,
                ]}
                onPress={() => toggleCategory(category.value)}
              >
                <Icon
                  name={category.icon}
                  size={32}
                  color={selectedCategories.includes(category.value) ? '#fff' : '#295259'}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category.value) && styles.selectedCategoryText,
                  ]}
                  numberOfLines={2}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
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
              onPress={handleNext}
            >
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
  instructionText: {
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 20,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryTag: {
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
  selectedCategoryTag: {
    backgroundColor: '#295259',
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryText: {
    color: '#4A4A4A',
    textAlign: 'center',
    fontSize: 16,
  },
  selectedCategoryText: {
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

export default RegistrationFormStep3;
