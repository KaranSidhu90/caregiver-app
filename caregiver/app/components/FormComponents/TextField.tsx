import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

type Props = {
  title?: string;
  placeholder: string;
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'phone';
  required?: boolean;
  errorMessage?: string;
  textSize?: number;
  onChangeText?: (text: string) => void;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onSubmitEditing?: () => void;
};

const TextField = forwardRef<TextInput, Props>(({
  title,
  placeholder,
  type,
  required = false,
  errorMessage,
  textSize = 14,
  onChangeText,
  returnKeyType,
  onSubmitEditing,
}, ref) => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const keyboardType = type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : 'default';
  const secureTextEntry = type === 'password';

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
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { fontSize: textSize }, touched && !value && required ? styles.inputError : null]}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        value={value}
        ref={ref}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
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

export default TextField;
