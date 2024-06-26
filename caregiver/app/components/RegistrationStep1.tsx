import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegistrationHeader from './RegistrationHeader';
import RegistrationFormStep1 from './RegistrationFormStep1';

type Props = {
  navigation: any;
};

const RegistrationStep1: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <RegistrationHeader title="BASIC INFORMATION" step="Step 1 of 5" icon='user' />
      <RegistrationFormStep1 navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default RegistrationStep1;
