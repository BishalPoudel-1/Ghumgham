import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('Feed');

  const travelers = [
    { name: 'Bishal P.', image: require('../../assets/images/bishal.png') },
    { name: 'Dulrav B.', image: require('../../assets/images/dulrav.png') },
    { name: 'Arpan C.', image: require('../../assets/images/arpan.png') },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <Text style={styles.header}>Community</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['Feed', 'Event', 'Message'].map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Travelers */}
        <View style={styles.travelersHeader}>
          <Text style={styles.subHeading}>Nearby Travelers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {travelers.map((item, index) => (
            <View key={index} style={{ alignItems: 'center', marginRight: 16 }}>
              <Image source={item.image} style={styles.avatar} />
              <Text style={styles.avatarName}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Post */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image source={require('../../assets/images/bishal.png')} style={styles.avatarSmall} />
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.posterName}>Bishal Poudel</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.timestamp}>2 Hour ago, Garden of Dream, Kathmandu</Text>
            </View>
          </View>
          <Text style={styles.postText}>
            It's an ideal spot for relaxation, reading, or enjoying a quiet moment amidst nature.
          </Text>
          <Image
            source={require('../../assets/images/garden.png')}
            style={styles.postImage}
          />
        </View>
      </ScrollView>

      
    </View>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    color: '#222',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  activeTab: {
    color: '#43A047',
    fontWeight: '600',
  },
  underline: {
    height: 2,
    backgroundColor: '#43A047',
    marginTop: 4,
  },
  travelersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    color: '#43A047',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 12,
  },
  avatarName: {
    fontSize: 12,
    marginTop: 4,
  },
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  posterName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  verifiedBadge: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: '#43A047',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    color: '#777',
  },
  postText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#F8F9EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
