import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

type Props = {
  activeTab: string;
  onTabPress: (tab: string) => void;
  tabs: { label: string; value: string }[];
};

const Tabs: React.FC<Props> = ({ activeTab, onTabPress, tabs }) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs?.map((tab, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeTab === tab.value ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => onTabPress(tab.value)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.value
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginTop: -20,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 35,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#C2A27C",
  },
  inactiveTab: {
    backgroundColor: "#E0E0E0",
  },
  tabText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    textAlign: "center",
  },
  activeTabText: {
    color: "#fff",
  },
  inactiveTabText: {
    color: "#4A4A4A",
  },
});

export default Tabs;
