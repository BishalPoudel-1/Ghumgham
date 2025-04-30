import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} backgroundColor="#F8F9EA" />

      {/* Tab Screens */}
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={() => null}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon name="home" label="Home" onPress={() => router.push('/')} active={pathname === '/'} />
        <NavIcon name="map" label="Map" onPress={() => router.push('/tourmap')} active={pathname === '/tourmap'} />
        <NavIcon name="compass" label="Explore" onPress={() => router.push('/explore')} active={pathname === '/explore'} />
        <NavIcon name="people" label="Community" onPress={() => router.push('/community')} active={pathname === '/community'} />
        <TouchableOpacity onPress={() => setShowMoreMenu(true)}>
          <Icon name="ellipsis-horizontal" size={24} color="#777" />
        </TouchableOpacity>
      </View>

      {/* More Menu Modal */}
      <Modal
        visible={showMoreMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <View style={styles.moreMenuOverlay}>
          <View style={styles.moreMenuBox}>
          {[
  { label: 'Trips', icon: 'calendar', route: '/trips' },
  { label: 'Virtual Tours', icon: 'glasses', route: '/virtual-tours' },
  { label: 'Emergency & Safety', icon: 'medkit', route: '/emergency' },
  { label: 'Expense Manager', icon: 'wallet', route: '/expenses' },
  { label: 'Profile', icon: 'person', route: '/profile' }, // ✅ route added
].map((item, index) => (
  <TouchableOpacity
    key={index}
    style={styles.moreItem}
    onPress={() => {
      setShowMoreMenu(false);
      router.push(item.route); // ✅ Navigate to the route
    }}
  >
    <Icon name={item.icon} size={24} color="#37474F" />
    <Text style={styles.moreLabel}>{item.label}</Text>
  </TouchableOpacity>
))}


            <TouchableOpacity onPress={() => setShowMoreMenu(false)} style={styles.closeBtn}>
              <Icon name="close" size={30} color="#37474F" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Reusable nav icon component
const NavIcon = ({ name, onPress, active }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon name={name} size={24} color={active ? '#43A047' : '#777'} />
  </TouchableOpacity>
);

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
