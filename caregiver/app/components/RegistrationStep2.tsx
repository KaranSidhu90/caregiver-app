import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegistrationHeader from './RegistrationHeader';
import RegistrationFormStep2 from './RegistrationFormStep2';

type Props = {
  navigation: any;
};

const RegistrationStep2: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <RegistrationHeader title="BASIC INFORMATION II" step="Step 2 of 5" icon='user' />
      <RegistrationFormStep2 navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default RegistrationStep2;
