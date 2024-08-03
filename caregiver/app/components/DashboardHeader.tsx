import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AnimatedPolygon from "./AnimatedPolygon";

type Props = {
  name: string;
  timeOfDay: string;
  navigation: any; // Add navigation prop
  bgColor?: string;
};

const DashboardHeader: React.FC<Props> = ({
  name,
  timeOfDay,
  navigation,
  bgColor,
}) => {
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: bgColor ?? "#295259" },
      ]}
    >
      <AnimatedPolygon delay={0} toValue={0} />
      <AnimatedPolygon delay={0} toValue={70} />
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.openDrawer()}
        >
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Hi {name}</Text>
        <Text style={styles.timeOfDay}>{timeOfDay}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: "35%",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    paddingTop: 50,
    zIndex: -999,
    marginBottom: -70,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    top: 10,
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 50,
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 80,
  },
  greeting: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    fontSize: 20,
    marginBottom: 5,
  },
  timeOfDay: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 24,
  },
});

export default DashboardHeader;
