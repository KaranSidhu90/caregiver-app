// BookingTabs.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type TabItem = {
  title: string;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  textColor: string;
};

type BookingTabsProps = {
  activeTab: number;
  onChangeTab: (index: number) => void;
};

const tabItems: TabItem[] = [
  {
    title: 'Pending',
    iconName: 'clock-o',
    iconColor: '#C2A27C',
    backgroundColor: '#C2A27C',
    textColor: '#ffffff',
  },
  {
    title: 'Accepted',
    iconName: 'check',
    iconColor: '#295259',
    backgroundColor: '#295259',
    textColor: '#ffffff',
  },
  {
    title: 'Cancelled',
    iconName: 'times',
    iconColor: 'rgba(255, 0, 0, 0.7)',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    textColor: '#ffffff',
  },
];

const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, onChangeTab }) => {
  return (
    <View style={styles.tabsContainer}>
      {tabItems.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabButton,
            activeTab === index && { backgroundColor: tab.backgroundColor },
          ]}
          onPress={() => onChangeTab(index)}
        >
          <Icon
            name={tab.iconName}
            size={20}
            color={activeTab === index ? tab.textColor : tab.iconColor}
            style={styles.icon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === index && { color: tab.textColor },
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    shadowColor: '#ddd',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
  },
  icon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
});

export default BookingTabs;
