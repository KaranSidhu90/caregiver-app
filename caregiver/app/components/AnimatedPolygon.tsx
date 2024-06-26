import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

type Props = {
  delay?: number;
  toValue?: number;
};

const AnimatedPolygon: React.FC<Props> = ({ delay = 0, toValue = 0 }) => {
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: toValue,
      duration: 1000,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, delay, toValue]);

  return (
    <Animated.View style={{ ...styles.polygonContainer, transform: [{ translateX: slideAnim }] }}>
      <Svg height="100%" width="150%" viewBox="0 0 100 100">
      <Polygon
          points="0,100 100,100 100,0"
          fill="rgba(255, 255, 255, 0.1)"
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  polygonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
});

export default AnimatedPolygon;
