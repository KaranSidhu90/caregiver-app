import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  options: { label: string, value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  textSize?: number; 
  selectedColor?: string;
};

const RadioTag: React.FC<Props> = ({ options, selectedValue, onSelect, textSize = 14, selectedColor = '#fff' }) => {
  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[styles.tag, selectedValue === option.value && styles.selectedTag]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[styles.tagText, { fontSize: textSize }, selectedValue === option.value && { color: selectedColor }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tag: {
    borderWidth: 2,
    borderColor: '#295259',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  selectedTag: {
    backgroundColor: '#295259',
  },
  tagText: {
    color: '#4A4A4A',
  },
});

export default RadioTag;
