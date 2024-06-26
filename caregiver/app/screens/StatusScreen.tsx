import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withRepeat, withDelay } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

type RootStackParamList = {
  StatusScreen: { status: string; title: string; message: string; duration: number; onContinue: () => void };
};

type StatusScreenRouteProp = RouteProp<RootStackParamList, 'StatusScreen'>;
type StatusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StatusScreen'>;

const { width } = Dimensions.get('window');

const StatusScreen: React.FC = () => {
  const navigation = useNavigation<StatusScreenNavigationProp>();
  const route = useRoute<StatusScreenRouteProp>();
  const { status, title, message, duration, onContinue } = route.params;

  const [showConfetti, setShowConfetti] = useState(false);

  const iconScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const iconShake = useSharedValue(0);

  useEffect(() => {
    if (status === 'success') {
      iconScale.value = withTiming(1, { duration: 1000 });
      setShowConfetti(true);
    } else if (status === 'failure') {
      iconShake.value = withRepeat(
        withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 })),
        -1,
        true
      );
    } else if (status === 'warning') {
      iconRotation.value = withRepeat(withTiming(15, { duration: 1000 }), -1, true);
    }

    messageOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

    const timer = setTimeout(() => {
      onContinue();
    }, duration - 1000);

    return () => clearTimeout(timer);
  }, [status, iconScale, messageOpacity, iconRotation, iconShake, duration, onContinue]);

  const getIconName = () => {
    switch (status) {
      case 'success':
        return 'check-circle';
      case 'failure':
        return 'times-circle';
      case 'warning':
        return 'exclamation-circle';
      default:
        return 'info-circle';
    }
  };

  const iconStyle = useAnimatedStyle(() => {
    if (status === 'success') {
      return {
        transform: [{ scale: iconScale.value }],
      };
    } else if (status === 'failure') {
      return {
        transform: [{ translateX: iconShake.value }],
      };
    } else if (status === 'warning') {
      return {
        transform: [{ rotate: `${iconRotation.value}deg` }],
      };
    } else {
      return {};
    }
  });

  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.icon, iconStyle]}>
        <Icon name={getIconName()} size={180} color="#295259" />
      </Animated.View>
      <Animated.View style={[styles.messageContainer, messageStyle]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
      {showConfetti && <ConfettiCannon count={200} origin={{ x: width / 2, y: 0 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: '#295259',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

export default StatusScreen;
