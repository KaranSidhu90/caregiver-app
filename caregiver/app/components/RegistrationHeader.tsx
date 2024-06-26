import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'galio-framework';
import AnimatedPolygon from './AnimatedPolygon';
import Icon from 'react-native-vector-icons/FontAwesome5';

type Props = {
  title: string;
  step: string;
  icon: string;
};

const RegistrationHeader: React.FC<Props> = ({ title, step, icon }) => {
  return (
    <View style={styles.headerContainer}>
      <AnimatedPolygon delay={0} toValue={0} />
      <AnimatedPolygon delay={0} toValue={70}/>
      <View style={styles.headerContent}>
        <Icon style={styles.icon} name={icon} size={100} color="#fff" />
        <Text h5 style={styles.headerText}>{title}</Text>
        <Text p muted style={styles.step}>{step}</Text>
        {/* <Icon name="info" size={24} color="#fff" style={styles.infoIcon} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#295259',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: 50,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Poppins-Semibold',
    color: '#fff',
    fontSize: 24,
    marginVertical: 10,
  },
  icon: {
    marginBottom: 10,
  },
  step: {
    fontFamily:'Poppins-Medium',
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  infoIcon: {
    position: 'absolute',
    top: 10,
    right: -30,
  },
});

export default RegistrationHeader;
