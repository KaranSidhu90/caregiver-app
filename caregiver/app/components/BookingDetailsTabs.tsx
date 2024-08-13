import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Tabs from '../components/Tabs';

type Props = {
  additionalInfo: string;
  ailmentCategories: string[];
  ailments: string[];
};

const BookingDetailsTabs: React.FC<Props> = ({ additionalInfo, ailmentCategories, ailments }) => {
  const [activeTab, setActiveTab] = useState('Details');

  const tabs = [
    { label: 'Details', value: 'Details' },
    { label: 'Special Needs', value: 'SpecialNeeds' },
  ];

  return (
    <View>
      <Tabs tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
      <View style={styles.tabContent}>
        {activeTab === 'Details' ? (
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfo}>
              {additionalInfo || 'No additional details provided.'}
            </Text>
          </View>
        ) : (
          <View style={styles.specialNeedsContainer}>
            <Text style={styles.specialNeedsHeader}>Ailment Categories</Text>
            <View style={styles.chipsContainer}>
              {ailmentCategories && ailmentCategories.length > 0 ? (
                ailmentCategories.map((category, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{category}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSpecialNeedsText}>No ailment categories available.</Text>
              )}
            </View>
            
            <Text style={styles.specialNeedsHeader}>Ailments</Text>
            <View style={styles.chipsContainer}>
              {ailments && ailments.length > 0 ? (
                ailments.map((ailment, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{ailment}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSpecialNeedsText}>No ailments available.</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({  
  tabContent: {
    marginTop: -35,
    zIndex: -10,
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: '#295259',
    color: '#ffffff',
  },
  additionalInfoContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  additionalInfo: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  specialNeedsContainer: {
    padding: 15,
    marginBottom: 15,
  },
  specialNeedsHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
    marginBottom: 5,
    color: '#ffffff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#C2A27C',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 4,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  noSpecialNeedsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#C2A27C',
    marginBottom: 10,
  },
});

export default BookingDetailsTabs;
