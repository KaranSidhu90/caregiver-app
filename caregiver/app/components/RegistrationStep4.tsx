import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegistrationHeader from './RegistrationHeader';
import RegistrationFormStep4 from './RegistrationFormStep4';

type Props = {
  navigation: any;
};

const RegistrationStep4: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <RegistrationHeader title="HEALTH DETAILS" step="Step 4 of 5" icon='medkit' />
      <RegistrationFormStep4 navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default RegistrationStep4;
