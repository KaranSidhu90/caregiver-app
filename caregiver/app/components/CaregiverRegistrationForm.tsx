import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import PhoneInput from "react-native-phone-input";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import { provinces } from "./RegistrationFormStep2";
import { formatZipCode } from "../../utils/formatters";
import Chips from "./Chips";
import FormSeparator from "./FormSeparator";
import axios from "axios";
import API_ENDPOINTS from "../../config/apiEndpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from '../providers/UserContext'; // Import UserContext

type Props = {
  navigation: any;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  imageUrl: string;
  userType: string;
  experience: string;
  activeClients: string;
  totalClients: string;
  skills: string[];
  category: string;
  passCode?: string;
};

const caregiverCategories = [
  { label: "Elderly Care", value: "Elderly Care" },
  { label: "Personal Care", value: "Personal Care" },
  { label: "Palliative Care", value: "Palliative Care" },
  { label: "Household Care", value: "Household Care" },
  { label: "Companionship", value: "Companionship" },
  { label: "Dementia Care", value: "Dementia Care" },
];

const CaregiverRegisterForm: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling loading state
  const { setUserType, setUserName, setUserId } = useUserContext(); // Use UserContext
  
  const {
    name,
    phoneNumber,
    email,
    dob,
    gender,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    experience,
    activeClients,
    totalClients,
    category,
    skills,
    passCode,
  } = formData;

  // Fill the form with mock user data (you can remove this in production)
  useEffect(() => {
    setFormData({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      phoneNumber: "+1 306-891-6969",
      gender: "Male",
      dob: new Date(),
      addressLine1: "123 Main St",
      addressLine2: "Apt 4B",
      city: "Toronto",
      state: "ON",
      zipCode: "A1B 2C3",
      imageUrl: "https://example.com/profile.jpg",
      userType: "Caregiver",
      experience: "5",
      activeClients: "3",
      totalClients: "10",
      skills: ["First Aid", "CPR"],
      category: "Elderly Care",
      passCode: "1234",
    });
  }, []);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const updateFormData = useCallback(
    (key: string, value: any) => {
      setFormData({
        ...formData,
        [key]: value,
      });
    },
    [formData]
  );

  const validateFormData = useCallback(() => {
    const requiredFields = [
      "name",
      "phoneNumber",
      "email",
      "dob",
      "gender",
      "addressLine1",
      "city",
      "state",
      "zipCode",
      "experience",
      "activeClients",
      "totalClients",
      "category",
      "skills",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof RegisterFormData]
    );

    if (missingFields.length) {
      Alert.alert("Missing Fields", "Please fill in all required fields");
      return false;
    }

    return true;
  }, [formData]);

  const submitForm = useCallback(async () => {
    if (!validateFormData()) {
      return;
    }

    try {
      setIsSubmitting(true); // Start loading

      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, formData);

      if (response.status === 201) {
        const { token, email, name, id, userType } = response.data;

        await setAuthToken(token);
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userName", name);
        await AsyncStorage.setItem("userId", id);
        await AsyncStorage.setItem("userType", userType);

        // Update UserContext
        setUserType(userType);
        setUserName(name);
        setUserId(id);

        navigation.navigate("CaregiverFlow");
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during API call:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("API Error Response:", error.response.data);
        Alert.alert("Error", `Registration failed: ${error.response.data.message}`);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  }, [formData, validateFormData, navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" enabled>
      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Name?<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              style={styles.input}
              onChangeText={(text) => updateFormData("name", text)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Email?<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              style={styles.input}
              onChangeText={(text) => updateFormData("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Phone Number?<Text style={styles.required}> *</Text>
            </Text>
            <PhoneInput
              initialCountry="ca"
              autoFormat={true}
              initialValue={phoneNumber}
              onChangePhoneNumber={(number) =>
                updateFormData("phoneNumber", number)
              }
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
            <Text style={styles.label}>
              Date of Birth?<Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              style={styles.fullInputContainer}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter your date of birth"
                  value={dob ? moment(dob).format("MMM DD YYYY") : ""}
                  style={styles.dateInput}
                  editable={false}
                />
                <Icon name="calendar" size={20} style={styles.icon} />
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              display="spinner"
              date={dob || new Date()}
              textColor="#295259"
              onConfirm={(date) => {
                updateFormData("dob", date);
                setDatePickerVisibility(false);
              }}
              onCancel={() => setDatePickerVisibility(false)}
              maximumDate={new Date()}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Gender<Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.radioContainer}>
              {["Male", "Female", "Other"].map((genderName) => (
                <TouchableOpacity
                  key={genderName}
                  style={[
                    styles.radioTag,
                    gender === genderName && styles.selectedRadioTag,
                  ]}
                  onPress={() => updateFormData("gender", genderName)}
                >
                  <Text
                    style={[
                      styles.radioText,
                      gender === genderName && styles.selectedRadioText,
                    ]}
                  >
                    {genderName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <FormSeparator title="Address" />
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Address Line 1<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your address line 1"
              style={styles.input}
              onChangeText={(text) => updateFormData("addressLine1", text)}
              value={addressLine1}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              placeholder="Enter your address line 2"
              style={styles.input}
              onChangeText={(text) => updateFormData("addressLine2", text)}
              value={addressLine2}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              City<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your city"
              style={styles.input}
              onChangeText={(text) => updateFormData("city", text)}
              value={city}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, styles.stateContainer]}>
              <Text style={styles.label}>
                Province<Text style={styles.required}> *</Text>
              </Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                items={provinces}
                value={state}
                onValueChange={(value) => updateFormData("state", value)}
              />
            </View>

            <View style={(styles.fieldContainer, styles.zipCodeContainer)}>
              <Text style={styles.label}>
                Postal Code<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                placeholder="Enter your postal code"
                style={styles.input}
                onChangeText={(text) =>
                  updateFormData("zipCode", formatZipCode(text))
                }
                value={formatZipCode(zipCode)}
              />
            </View>
          </View>
          <FormSeparator title="Work Details" />
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Experience (years)<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter your experience in years"
              style={styles.input}
              onChangeText={(text) => updateFormData("experience", text)}
              value={experience}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Active Clients<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                placeholder="Clients number"
                style={styles.input}
                onChangeText={(text) => updateFormData("activeClients", text)}
                value={activeClients}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Total Clients<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                placeholder="Total clients"
                style={styles.input}
                onChangeText={(text) => updateFormData("totalClients", text)}
                value={totalClients}
                keyboardType="numeric"
              ></TextInput>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Category<Text style={styles.required}> *</Text>
            </Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              items={caregiverCategories}
              value={category}
              onValueChange={(value) => updateFormData("category", value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Skills<Text style={styles.required}> *</Text>
            </Text>
            <Chips
              value={skills || []}
              inputStyle={styles.input}
              onChange={(value) => updateFormData("skills", value)}
            />
          </View>

          <FormSeparator title="Pass Code" />
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Pass Code (4 digits)</Text>
            <TextInput
              placeholder="Enter your pass code"
              style={styles.input}
              keyboardType="numeric"
              value={passCode}
              onChangeText={(text) => updateFormData("passCode", text)}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#C2A27C" }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#295259" }]}
              onPress={submitForm}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderColor: "#295259",
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 50,
    borderColor: "#295259",
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    margin: 10,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },

  fieldContainer: {
    marginBottom: 20,
    flex: 1,
  },

  cityContainer: {
    flex: 2,
    marginRight: 10,
  },

  stateContainer: {
    flex: 2,
  },

  zipCodeContainer: {
    flex: 1,
  },

  label: {
    fontFamily: "Poppins-Regular",
    color: "#4A4A4A",
    marginBottom: 5,
    fontSize: 16,
  },
  required: {
    color: "red",
  },
  input: {
    height: 50,
    borderColor: "#295259",
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  fullInputContainer: {
    height: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    borderColor: "#295259",
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A",
  },
  icon: {
    marginLeft: 10,
    color: "#295259",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioTag: {
    borderWidth: 2,
    borderColor: "#295259",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  selectedRadioTag: {
    backgroundColor: "#295259",
  },
  radioText: {
    color: "#4A4A4A",
    fontSize: 16,
  },
  selectedRadioText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  phoneInput: {
    borderColor: "#295259",
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 50,
    marginTop: 10,
  },
});

export default CaregiverRegisterForm;
