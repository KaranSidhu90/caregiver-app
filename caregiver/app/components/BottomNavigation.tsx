import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

const BottomNavigation: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={120} style={styles.svgStyle}>
        <Path
          d={`
            M0,50 
            L${width * 0.36},50 
            Q${width * 0.5},-50 ${width * 0.64},50 
            L${width},50 
            L${width},150 
            L0,150 
            Z
          `}
          fill="#F0F0F0"  
        />
      </Svg>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate(state.routes[0].name)}
        >
          <Icon name="home" size={30} color="#295259" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, styles.iconButtonWithMargin]}
          onPress={() => navigation.navigate(state.routes[1].name)}
        >
          <Icon name="users" size={30} color="#295259" />
        </TouchableOpacity>

        <View style={styles.sosButtonWrapper}>
          <TouchableOpacity style={styles.sosButton}>
            <Icon name="search" size={35} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.iconButton, styles.iconButtonWithMargin]}
          onPress={() => navigation.navigate(state.routes[2].name)}
        >
          <Icon name="history" size={30} color="#295259" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate(state.routes[3].name)}
        >
          <Icon name="user" size={30} color="#295259" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 150,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  svgStyle: {
    position: 'absolute',
    bottom: 0,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 20, 
    paddingHorizontal: 20,
  },
  iconButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonWithMargin: {
    marginHorizontal: 20, 
  },
  sosButtonWrapper: {
    position: 'absolute',
    top: -65, 
    left: width / 2 - 35, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#295259',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#C8A77A',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default BottomNavigation;
