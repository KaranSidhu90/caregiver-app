import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signOut } from '../../utils/auth';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
};

const Sidebar: React.FC<Props> = ({ navigation }) => {
  const handleSignOut = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={styles.sidebar}>
      <View style={[styles.header, { paddingTop: 185 }]}>
        <Text style={styles.menuTitle}>Menu</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.closeDrawer()}>
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('All Caregivers')}>
          <Text style={styles.menuItem}>All Caregivers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
          <Text style={styles.menuItem}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Booking Agenda')}>
          <Text style={styles.menuItem}>Booking Agenda</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
          <Icon name="power-off" size={20} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#295259',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  closeButton: {
    marginLeft: 'auto',
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
    color: '#ffffff',
  },
  topContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 35,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  menuItem: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#4A4A4A',
    marginBottom: 15,
  },
});

export default Sidebar;
