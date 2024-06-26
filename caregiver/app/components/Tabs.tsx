import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type Props = {
  activeTab: string;
  onTabPress: (tab: string) => void;
};

const Tabs: React.FC<Props> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'Skills' ? styles.activeTab : styles.inactiveTab]}
        onPress={() => onTabPress('Skills')}
      >
        <Text style={[styles.tabText, activeTab === 'Skills' ? styles.activeTabText : styles.inactiveTabText]}>Skills</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'Reviews' ? styles.activeTab : styles.inactiveTab]}
        onPress={() => onTabPress('Reviews')}
      >
        <Text style={[styles.tabText, activeTab === 'Reviews' ? styles.activeTabText : styles.inactiveTabText]}>Reviews</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginTop: -20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 35,
    width: '45%',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#C2A27C',
  },
  inactiveTab: {
    backgroundColor: '#E0E0E0',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#4A4A4A',
  },
});

export default Tabs;
