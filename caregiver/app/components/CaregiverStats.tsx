import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  category: string;
  activeClients: number;
  totalClients: number;
  distance: string;
};

const CaregiverStats: React.FC<Props> = ({ category, activeClients, totalClients, distance }) => {
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statItem, styles.borderRight]}>
        <Text style={styles.statValue}>{distance}</Text>
        <Text style={styles.statLabel}>Distance</Text>
      </View>
      <View style={[styles.statItem, styles.borderRight]}>
        <Text style={styles.statValue}>{activeClients}</Text>
        <Text style={styles.statLabel}>Active Clients</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalClients}</Text>
        <Text style={styles.statLabel}>Total Clients</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 10,
    marginTop: -25,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  statValue: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 18,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#B0B0B0',
  },
});

export default CaregiverStats;
