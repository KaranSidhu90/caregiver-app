import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const VisitTiming: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('Morning');

  const visitOptions = [
    { label: 'Morning', subLabel: '8AM - 12PM' },
    { label: 'Afternoon', subLabel: '1PM - 5PM' },
    { label: 'Evening', subLabel: '6PM - 10PM' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Visit</Text>
      <View style={styles.optionsContainer}>
        {visitOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.option,
              selectedOption === option.label && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option.label)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option.label && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionSubText,
                selectedOption === option.label && styles.selectedOptionText,
              ]}
            >
              {option.subLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#295259',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Semibold',
    color: '#4A4A4A',
  },
  selectedOptionText: {
    color: '#fff',
  },
  optionSubText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
  },
});

export default VisitTiming;
