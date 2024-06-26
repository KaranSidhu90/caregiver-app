import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegistrationHeader from './RegistrationHeader';
import RegistrationFormStep3 from './RegistrationFormStep3';

type Props = {
  navigation: any;
};

const RegistrationStep3: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <RegistrationHeader title="HEALTH INFORMATION" step="Step 3 of 5" icon='first-aid' />
      <RegistrationFormStep3 navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default RegistrationStep3;
