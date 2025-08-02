import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../theme-context';
import Firstpage from '../firstpage';
import Register from '../register';



export default function AppLayout() {
  const { isDarkMode } = useTheme();
  return (
    <ThemeProvider>
      
      <TabLayout />
      
    </ThemeProvider>
  );
}

function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { isDarkMode } = useTheme();

  type AllowedRoutes =
    | '/trips'
    | '/virtual-tours'
    | '/emergency'
    | '/expenses'
    | '/profile';

  type MoreMenuItem = {
    label: string;
    icon: string;
    route: AllowedRoutes;
  };

  const moreItems: MoreMenuItem[] = [
    { label: 'Trips', icon: 'calendar', route: '/trips' },
    { label: 'Virtual Tours', icon: 'glasses', route: '/virtual-tours' },
    { label: 'Emergency & Safety', icon: 'medkit', route: '/emergency' },
    { label: 'Expense Manager', icon: 'wallet', route: '/expenses' },
    { label: 'Profile', icon: 'person', route: '/profile' },
  ];

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <StatusBar
        style={isDarkMode ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={isDarkMode ? '#121212' : '#F8F9EA'}
      />

      <Tabs screenOptions={{ headerShown: false }} tabBar={() => null} />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, isDarkMode && { backgroundColor: '#1e1e1e' }]}>
        <NavIcon name="home" onPress={() => router.push('/')} active={pathname === '/'} />
        <NavIcon name="map" onPress={() => router.push('/tourmap')} active={pathname === '/tourmap'} />
        <NavIcon name="compass" onPress={() => router.push('/explore')} active={pathname === '/explore'} />
        <NavIcon name="people" onPress={() => router.push('/community')} active={pathname === '/community'} />
        <TouchableOpacity onPress={() => setShowMoreMenu(true)}>
          <Icon name="ellipsis-horizontal" size={24} color={isDarkMode ? '#ccc' : '#777'} />
        </TouchableOpacity>
      </View>

      {/* More Menu Modal */}
      <Modal
        visible={showMoreMenu}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <View style={styles.moreMenuOverlay}>
          <View style={[styles.moreMenuBox, isDarkMode && { backgroundColor: '#333' }]}>
            {moreItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.moreItem}
                onPress={() => {
                  setShowMoreMenu(false);
                  router.push(item.route);
                }}
              >
                <Icon name={item.icon} size={24} color={isDarkMode ? '#fff' : '#37474F'} />
                <Text style={[styles.moreLabel, isDarkMode && { color: '#fff' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowMoreMenu(false)} style={styles.closeBtn}>
              <Icon name="close" size={30} color={isDarkMode ? '#fff' : '#37474F'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ✅ Fixed NavIcon props typing
type NavIconProps = {
  name: string;
  onPress: () => void;
  active: boolean;
};

const NavIcon = ({ name, onPress, active }: NavIconProps) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name={name}
        size={24}
        color={active ? '#43A047' : isDarkMode ? '#bbb' : '#777'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#F8F9EA',
  },
  moreMenuOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  moreMenuBox: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moreItem: {
    alignItems: 'center',
    margin: 15,
    width: Dimensions.get('window').width / 5,
  },
  moreLabel: {
    fontSize: 12,
    color: '#37474F',
    marginTop: 6,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
});
