import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type BookingTabsProps = {
  activeTab: number;
  onChangeTab: (index: number) => void;
  tabs: string[]; // Add tabs prop
};

const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, onChangeTab, tabs }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tabButton, activeTab === index && styles.activeTabButton]}
          onPress={() => onChangeTab(index)}
        >
          <Text style={[styles.tabButtonText, activeTab === index && styles.activeTabButtonText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
  },
  activeTabButton: {
    backgroundColor: '#295259',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
});

export default BookingTabs;
