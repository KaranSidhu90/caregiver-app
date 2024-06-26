import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

type Props = {
  onBookVisit: () => void;
  onGoBack: () => void;
};

const ActionButtons: React.FC<Props> = ({ onBookVisit, onGoBack }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.bookButton]} onPress={onBookVisit}>
        <Text style={styles.buttonText}>BOOK VISIT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.goBackButton]} onPress={onGoBack}>
        <Text style={styles.buttonText}>GO BACK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 35,
    marginVertical: 5,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#295259',
  },
  goBackButton: {
    backgroundColor: '#C2A27C',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#ffffff',
  },
});

export default ActionButtons;
