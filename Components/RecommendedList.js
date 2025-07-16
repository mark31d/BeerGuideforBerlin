import React, { useContext, useMemo, useCallback, useState } from 'react';
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

import { SPOTS } from './spots';
import { SavedContext } from './SavedContext';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_BORDER_RADIUS = 10;

/* ---------- Карточка списка ---------- */
const SpotItem = React.memo(function SpotItem({ spot, isSaved, toggleSave }) {
  const nav = useNavigation();
  const [textWidth, setTextWidth] = useState(0);

  return (
    <View style={styles.card}>
      <Image source={spot.img} style={styles.photo} />

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => toggleSave(spot)}
        activeOpacity={0.7}
      >
        <Image
          source={
            isSaved
              ? require('../assets/heart_filled.png')
              : require('../assets/heart_outline.png')
          }
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
}, (prev, next) => prev.spot.id === next.spot.id && prev.isSaved === next.isSaved);

/* ---------- Список ---------- */
export default function RecommendedList() {
  const nav = useNavigation();
  const { saved, toggle, isSaved } = useContext(SavedContext);

  // только рекомендованные
  const spots = useMemo(() => SPOTS.recommended, []);

  const toggleSave = useCallback(spot => toggle(spot), [toggle]);

  const renderItem = useCallback(
    ({ item }) => (
      <SpotItem
        spot={item}
        isSaved={isSaved(item.id)}
        toggleSave={toggleSave}
      />
    ),
    [isSaved, toggleSave]
  );

  return (
    <View style={styles.container}>
      {/* Хедер */}
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
          <Text style={styles.headerTitle}>Recommended places to visit</Text>
        </LinearGradient>
      </View>

      <FlatList
        data={spots}
        keyExtractor={s => s.id}
        renderItem={renderItem}
        extraData={saved} // важно: чтобы перечерчивать иконки при изменении saved
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
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
    height: 90,
  },
  backBtn: { padding: 20 },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    left: -20,
  },

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

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  underline: {
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: { color: '#fff', fontSize: 14, marginRight: 8 },
  ratingIcon: { width: 20, height: 20, marginRight: 4 },

  // Выровнять кнопку по центру карточки
  readBtnWrapper: {
    alignSelf: 'center',
  },
  // Градиентный фон кнопки
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
