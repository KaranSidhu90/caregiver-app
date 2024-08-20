import React from 'react';
import { StyleSheet, View } from 'react-native';
import CaregiverRegistrationHeader from '../components/CaregiverRegistrationHeader';
import CaregiverRegisterForm from '../components/CaregiverRegistrationForm';

type Props = {
  navigation: any;
};

const CaregiverRegister: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CaregiverRegisterForm navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default CaregiverRegister;
