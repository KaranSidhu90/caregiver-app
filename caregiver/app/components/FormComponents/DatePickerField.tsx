import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

type Props = {
  title?: string;
  placeholder: string;
  required?: boolean;
  errorMessage?: string;
  textSize?: number;
  onChange?: (date: Date) => void;
};

const DatePickerField = forwardRef<TextInput, Props>(({
  title,
  placeholder,
  required = false,
  errorMessage,
  textSize = 14,
  onChange,
}, ref) => {
  const [date, setDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  const handleCancel = () => {
    setDatePickerVisibility(false);
  };

  const handleBlur = () => setTouched(true);

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.label, { fontSize: textSize }]}>{title}{required && <Text style={styles.required}> *</Text>}</Text>}
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.inputContainer, touched && !date && required ? styles.inputError : null]}>
        <TextInput
          placeholder={placeholder}
          value={date ? moment(date).format('MMM DD YYYY') : ''}
          style={styles.input}
          editable={false}
          onBlur={handleBlur}
          ref={ref}
        />
        <Icon name="calendar" size={20} style={styles.icon} />
      </TouchableOpacity>
      {touched && !date && required && (
        <Text style={styles.errorText}>{errorMessage || 'This field is required'}</Text>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display="spinner"
        textColor='#295259'
        date={date || new Date()}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        maximumDate={new Date()}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
  required: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: '#295259',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#295259',
  },
  icon: {
    marginLeft: 10,
    color: '#295259',
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

export default DatePickerField;
