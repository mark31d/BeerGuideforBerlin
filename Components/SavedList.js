import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { SavedContext } from './SavedContext';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 200;
const CARD_BORDER_RADIUS = 16;

export default function SavedList() {
  const nav = useNavigation();
  const { saved, toggle } = useContext(SavedContext);
  const [textWidth, setTextWidth] = useState(0);

  const isEmpty = saved.length === 0;

  const renderSpot = ({ item: spot }) => (
    <View style={styles.card}>
      <Image source={spot.img} style={styles.photo} />

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => toggle(spot)}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/heart_filled.png')}
          style={styles.heartIcon}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text
            style={styles.name}
            onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
          >
            {spot.name}
          </Text>
        </View>

        <View style={[styles.underline, { width: textWidth }]} />

        <View style={styles.row}>
          <Text style={styles.label}>Rating:</Text>
          {Array.from({ length: spot.rating }).map((_, i) => (
            <Image
              key={i}
              source={require('../assets/mug.png')}
              style={styles.ratingIcon}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => nav.navigate('LocationDetails', { spot })}
          activeOpacity={0.8}
          style={styles.readBtnWrapper}
        >
          <LinearGradient
            colors={['#BE9E77', '#633D0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.readBtn}
          >
            <Text style={styles.readTxt}>Read more</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={['#BE9E77', '#633D0F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Image
              source={require('../assets/BackArrow.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved places to visit</Text>
        </LinearGradient>
      </View>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no saved locations yet.</Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={s => s.id}
          renderItem={renderSpot}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  headerWrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,                 // ← как в RecommendList
  },
  backBtn: { padding: 20 },     // ← как в RecommendList
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,               // ← как в RecommendList
    fontWeight: '700',
    left: -20,                  // ← как в RecommendList
  },
  underline: {
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: '#fff', fontSize: 16 },

  listContent: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: '#262424',
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    borderColor: '#4E0202',
    borderWidth: 1,
    height: 290,
  },

  photo: {
    width: '100%',
    height: CARD_HEIGHT * 0.45,
  },

  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: { width: 20, height: 20, resizeMode: 'contain' },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: '#fff', fontSize: 20, fontWeight: '700', flex: 1 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: { color: '#fff', fontSize: 14, marginRight: 8 },
  ratingIcon: { width: 20, height: 20, marginRight: 4 },

  // центрирование и градиент для кнопки Read more
  readBtnWrapper: {
    alignSelf: 'center',
  },
  readBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    width:130,
    height:52,
  },
  readTxt: {
    padding:7,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
