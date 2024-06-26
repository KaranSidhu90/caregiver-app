import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  onBackPress: () => void;
};

const CaregiverProfileHeader: React.FC<Props> = ({ onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#4A4A4A" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: '#4A4A4A',
  },
});

export default CaregiverProfileHeader;
