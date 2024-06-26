import React, { useState, forwardRef } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

type Props = {
  title?: string;
  placeholder: string;
  required?: boolean;
  errorMessage?: string;
  textSize?: number;
  onChangeText?: (text: string) => void;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onSubmitEditing?: () => void;
};

const PhoneNumberField = forwardRef<TextInputMask, Props>(({
  title,
  placeholder,
  required = false,
  errorMessage,
  textSize = 14,
  onChangeText,
  returnKeyType,
  onSubmitEditing,
}, ref) => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const handleBlur = () => setTouched(true);
  const handleChangeText = (text: string) => {
    setValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.label, { fontSize: textSize }]}>{title}{required && <Text style={styles.required}> *</Text>}</Text>}
      <TextInputMask
        type={'custom'}
        options={{
          mask: '999-999-9999',
        }}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={[styles.input, { fontSize: textSize }, touched && !value && required ? styles.inputError : null]}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        ref={ref}
      />
      {touched && !value && required && (
        <Text style={styles.errorText}>{errorMessage || 'This field is required'}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
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
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default PhoneNumberField;
