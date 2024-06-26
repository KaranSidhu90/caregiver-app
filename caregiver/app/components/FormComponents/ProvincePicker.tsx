import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

type Props = {
  title?: string;
  placeholder: string;
  required?: boolean;
  errorMessage?: string;
  textSize?: number;
  onValueChange: (value: string) => void;
};

const provinces = [
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland and Labrador', value: 'NL' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Prince Edward Island', value: 'PE' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
];

const ProvincePicker: React.FC<Props> = ({ title, placeholder, required = false, errorMessage, textSize = 14, onValueChange }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={[styles.label, { fontSize: textSize }]}>{title}{required && <Text style={styles.required}> *</Text>}</Text>}
      <RNPickerSelect
        onValueChange={onValueChange}
        items={provinces}
        placeholder={{ label: placeholder, value: null }}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
      />
      {required && !onValueChange && (
        <Text style={styles.errorText}>{errorMessage || 'This field is required'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  label: {
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
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
    backgroundColor: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ProvincePicker;
