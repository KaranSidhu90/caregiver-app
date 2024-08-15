import React from 'react';
import { StyleSheet, View, TextInput, Text, Keyboard } from 'react-native';

type Props = {
  onInfoChange: (info: string) => void;
};

const AdditionalDetails: React.FC<Props> = ({ onInfoChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Additional Details</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Share any other details you think caregivers should know. Please do not enter any information that is critical to your security"
        placeholderTextColor="#295259"
        multiline
        numberOfLines={8}
        returnKeyType="done"
        blurOnSubmit={true} // Add this to dismiss the keyboard
        onChangeText={onInfoChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  textArea: {
    height: 400,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#4A4A4A',
    textAlignVertical: 'top',
  }
});

export default AdditionalDetails;
