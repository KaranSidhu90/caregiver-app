import React, {useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signOut } from '../../utils/auth';

const { width } = Dimensions.get('window');

type Props = {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
};

const Sidebar: React.FC<Props> = ({ isVisible, onClose, navigation }) => {
  const sidebarWidth = new Animated.Value(isVisible ? width : 0);

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: isVisible ? width * 0.75 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  const handleSignOut = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.content}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
          <Icon name="power-off" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#295259',
    padding: 20,
    zIndex: 1000,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
});

export default Sidebar;
