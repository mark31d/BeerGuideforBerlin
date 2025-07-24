// Components/LocationDetails.js

import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { SavedContext } from './SavedContext';

const { width } = Dimensions.get('window');
const CARD_PADDING = 24;
const CARD_RADIUS  = 16;

// иконки
const ICON_BACK    = require('../assets/BackArrow.png');
const ICON_PIN     = require('../assets/pin.png');
const ICON_BEER    = require('../assets/mug.png');
const ICON_HEART   = require('../assets/heart_outline.png');
const ICON_HEART_F = require('../assets/heart_filled.png');

export default function LocationDetails() {
  const nav   = useNavigation();
  const { spot } = useRoute().params;
  const { saved, toggle } = useContext(SavedContext);

  const isSaved = saved.some(s => s.id === spot.id);

  const handleShare = () => {
    Share.share({
      title: spot.name,
      message: `${spot.name}\n${spot.address}\n\nCoordinates: ${spot.coords.lat.toFixed(5)}, ${spot.coords.lon.toFixed(5)}`,
    });
  };

  const openMap = () => {
    nav.navigate('MapScreen', {
      initialSpotId: spot.id,
      initialCoords: { lat: spot.coords.lat, lon: spot.coords.lon },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header как в RecommendedList */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={['#BE9E77', '#633D0F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Image source={ICON_BACK} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{spot.name}</Text>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Image source={spot.img} style={styles.photo} />

          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => toggle(spot)}
            activeOpacity={0.7}
          >
            <Image
              source={isSaved ? ICON_HEART_F : ICON_HEART}
              style={styles.heartIcon}
            />
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.name}>{spot.name}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Rating:</Text>
              {Array.from({ length: spot.rating }).map((_, i) => (
                <Image key={i} source={ICON_BEER} style={styles.ratingIcon} />
              ))}
            </View>

            <View style={styles.row}>
              <Image source={ICON_PIN} style={styles.pinIcon} />
              <Text style={styles.address}>{spot.address}</Text>
            </View>

            <Text style={styles.desc}>{spot.desc}</Text>

            {/* Несколько кнопок в градиенте, как «Read more» */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnWrapper} onPress={openMap} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#BE9E77', '#633D0F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnGradientTxt}>Open in map</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnWrapper} onPress={handleShare} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#BE9E77', '#633D0F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnGradientTxt}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
    flexDirection:  'row',
    alignItems:     'center',
    height:         120,
  },
  backBtn:    { padding: 20 ,marginTop:30,},
  backIcon:   { width: 24, height: 24, resizeMode: 'contain', tintColor: '#fff' },
  headerTitle:{ 
    flex: 1, 
    textAlign: 'center', 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '700',
    left: -20,
    marginTop:30,
  },

  content: {
    padding: CARD_PADDING,
    paddingTop: CARD_PADDING + 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius:    CARD_RADIUS,
    overflow:        'hidden',
    borderColor:'#4E0202',
    borderWidth:2,
  },

  photo: {
    width:  '100%',
    height: width * 0.5,
  },
  heartBtn: {
    position:     'absolute',
    top:          16,
    right:        16,
    width:        32,
    height:       32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:   'center',
    zIndex:       2,
  },
  heartIcon:   { width:20, height:20, resizeMode:'contain' },

  info: {
    padding: 16,
  },
  name: {
    color:     '#fff',
    fontSize:  22,
    fontWeight:'700',
    marginBottom: 8,
  },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    marginBottom:    8,
  },
  label:      { color:'#fff', fontSize:14, marginRight:8 },
  ratingIcon: { width:20, height:20, marginRight:4 },
  pinIcon:    { width:18, height:18, marginRight:6, resizeMode:'contain'},
  address:    { color:'#fff', fontSize:15, flexShrink:1 },
  desc:       { color:'#ccc', fontSize:14, lineHeight:20, marginTop:12 },

  /* Обёртка и стили для градиентных кнопок */
  btnRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      1,
  },
  btnWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  btnGradient: {
    paddingVertical: 12,
    height:70,
    borderRadius:    8,
    alignItems:      'center',
  },
  btnGradientTxt: {
    color:     '#fff',
    fontSize:  16,
    fontWeight:'700',
  },
});
