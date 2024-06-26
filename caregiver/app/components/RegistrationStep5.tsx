import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegistrationHeader from './RegistrationHeader';
import RegistrationFormStep5 from './RegistrationFormStep5';

type Props = {
  navigation: any;
};

const RegistrationStep5: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <RegistrationHeader title="Care Needs" step="Step 5 of 5" icon='heartbeat' />
      <RegistrationFormStep5 navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default RegistrationStep5;
