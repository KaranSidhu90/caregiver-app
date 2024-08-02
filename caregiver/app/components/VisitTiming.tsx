import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type Slots = {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
};

type Props = {
  onSlotsChange: (slots: Slots) => void;
  bookedSlots: Slots;
};

const VisitTiming: React.FC<Props> = ({ onSlotsChange, bookedSlots }) => {
  const [selectedOption, setSelectedOption] = useState<keyof Slots>('morning');

  useEffect(() => {
    // Preselect the earliest available slot
    onSlotsChange({
      morning: true,
      afternoon: false,
      evening: false,
    });
  }, [onSlotsChange]);

  const visitOptions = [
    { label: 'Morning', subLabel: '8AM - 12PM', key: 'morning' as keyof Slots },
    { label: 'Afternoon', subLabel: '1PM - 5PM', key: 'afternoon' as keyof Slots },
    { label: 'Evening', subLabel: '6PM - 10PM', key: 'evening' as keyof Slots },
  ];

  const handleOptionPress = (option: keyof Slots) => {
    setSelectedOption(option);

    onSlotsChange({
      morning: option === 'morning',
      afternoon: option === 'afternoon',
      evening: option === 'evening',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Visit</Text>
      <View style={styles.optionsContainer}>
        {visitOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.option,
              selectedOption === option.key && styles.selectedOption,
              bookedSlots[option.key] && styles.disabledOption,
            ]}
            onPress={() => handleOptionPress(option.key)}
            disabled={bookedSlots[option.key]} // Disable if the slot is booked
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option.key && styles.selectedOptionText,
                bookedSlots[option.key] && styles.disabledOptionText,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionSubText,
                selectedOption === option.key && styles.selectedOptionText,
                bookedSlots[option.key] && styles.disabledOptionText,
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
  disabledOption: {
    backgroundColor: '#E0E0E0',
  },
  disabledOptionText: {
    color: '#A0A0A0',
  },
});

export default VisitTiming;
