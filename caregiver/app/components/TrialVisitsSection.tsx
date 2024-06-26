import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  visitsRemaining: number;
};

const TrialVisitsSection: React.FC<Props> = ({ visitsRemaining }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>As a new user we provide free of cost trial visits</Text>
      <View style={styles.visitsContainer}>
        <Text style={styles.visitsText}>Trial Visits Remaining</Text>
        <Text style={styles.visitsNumber}>{visitsRemaining}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  visitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E8F1F2',
    borderRadius: 10,
  },
  visitsText: {
    fontSize: 16,
    color: '#295259',
  },
  visitsNumber: {
    fontSize: 24,
    color: '#295259',
    fontWeight: 'bold',
  },
});

export default TrialVisitsSection;
