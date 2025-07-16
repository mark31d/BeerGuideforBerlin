// Components/MapScreen.js
import React, {
  useMemo,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Share,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { SPOTS } from './spots';
import { SavedContext } from './SavedContext';

const { width } = Dimensions.get('window');
const POPUP_W   = width * 0.86; // унифицированно с другими экранами
const HEADER_H  = 90;

const ICON_BACK  = require('../assets/BackArrow.png');
const ICON_PIN   = require('../assets/pin.png');
const ICON_MUG   = require('../assets/mug.png');
const ICON_CLOSE = require('../assets/close.png');   // кнопка закрытия карточки

/* Пределы зума (в градусах широты/долготы). Чем меньше delta — тем ближе. */
const MIN_DELTA = 0.002;  // ~ улица
const MAX_DELTA = 60;     // почти весь континент

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/* ---------- Карточка спота ---------- */
function SpotCard({ spot, onClose, onReadMore }) {
  const [titleW, setTitleW] = useState(0);

  return (
    <View style={styles.cardWrap}>
      {/* рамка поверх всего */}
      <View pointerEvents="none" style={styles.cardBorder} />

      {/* содержимое */}
      <View style={styles.cardInner}>
        {/* фото */}
        <Image source={spot.img} style={styles.cardPhoto} />

        {/* кнопка закрытия поверх фото */}
        <TouchableOpacity
          style={styles.cardCloseBtn}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Image source={ICON_CLOSE} style={styles.cardCloseIcon} />
        </TouchableOpacity>

        {/* тело */}
        <View style={styles.cardBody}>
          <Text
            style={styles.cardTitle}
            onLayout={e => setTitleW(e.nativeEvent.layout.width)}
            numberOfLines={2}
          >
            {spot.name}
          </Text>
          <View style={[styles.cardTitleLine, { width: titleW }]} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Rating:</Text>
            {Array.from({ length: spot.rating }).map((_, i) => (
              <Image key={i} source={ICON_MUG} style={styles.cardMug} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.cardBtnTouch}
            onPress={onReadMore}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#BE9E77', '#633D0F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cardBtnGrad}
            >
              <Text style={styles.cardBtnTxt}>Read more</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------- Основной экран ---------- */
export default function MapScreen() {
  const nav    = useNavigation();
  const route  = useRoute();
  const mapRef = useRef(null);
  const { saved, toggle } = useContext(SavedContext); // пока не используется

  // плоский массив спотов
  const spots = useMemo(() => Object.values(SPOTS).flat(), []);

  // стартовый регион
  const initial = route.params?.initialCoords;
  const [region, setRegion] = useState({
    latitude:      initial?.lat ?? spots[0].coords.lat,
    longitude:     initial?.lon ?? spots[0].coords.lon,
    latitudeDelta: 0.1,
    longitudeDelta:0.1,
  });

  // текущее открытое место
  const [current, setCurrent] = useState(null);

  // открыть попап и центровать карту
  const openSpot = spot => {
    setCurrent(spot);
    const r = {
      ...region,
      latitude:      spot.coords.lat,
      longitude:     spot.coords.lon,
      latitudeDelta: 0.05,
      longitudeDelta:0.05,
    };
    setRegion(r);
    mapRef.current?.animateToRegion(r, 400);
  };

  const closeSpot = () => setCurrent(null);

  const shareSpot = spot => {
    Share.share({
      title: spot.name,
      message: `${spot.name}\n${spot.address}`,
    });
  };

  /* ------------ КНОПКИ ЗУМА ------------ */
  // вычисляем, достигли ли границ
  const atMinZoom = region.latitudeDelta <= MIN_DELTA * 1.05
                 || region.longitudeDelta <= MIN_DELTA * 1.05;
  const atMaxZoom = region.latitudeDelta >= MAX_DELTA * 0.95
                 || region.longitudeDelta >= MAX_DELTA * 0.95;

  const zoom = factor => {
    setRegion(prev => {
      const newDeltaLat = clamp(prev.latitudeDelta * factor, MIN_DELTA, MAX_DELTA);
      const newDeltaLon = clamp(prev.longitudeDelta * factor, MIN_DELTA, MAX_DELTA);
      const r = {
        ...prev,
        latitudeDelta: newDeltaLat,
        longitudeDelta: newDeltaLon,
      };
      mapRef.current?.animateToRegion(r, 250);
      return r;
    });
  };
  const zoomIn  = () => { if (!atMinZoom) zoom(0.5); }; // ближе
  const zoomOut = () => { if (!atMaxZoom) zoom(2);   }; // дальше
  /* ------------------------------------- */

  // если пришёл initialSpotId — открыть
  useEffect(() => {
    if (route.params?.initialSpotId != null) {
      const idx = spots.findIndex(s => s.id === route.params.initialSpotId);
      if (idx >= 0) openSpot(spots[idx]);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* карта */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsCompass
      >
        {spots.map(s => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.coords.lat, longitude: s.coords.lon }}
            onPress={e => {
              e.stopPropagation();
              openSpot(s);
            }}
          >
            {/* уменьшенный пин */}
            <Image source={ICON_PIN} style={styles.pinImg} />
          </Marker>
        ))}
      </MapView>

      {/* кнопки зума (внизу справа) */}
      <View
        style={[
          styles.zoomWrap,
          // если карточка открыта, чуть выше чтобы не утонули за ней
          current ? styles.zoomWrapRaised : null,
        ]}
        pointerEvents="box-none"
      >
        {/* + */}
        <TouchableOpacity
          style={styles.zoomBtnTouch}
          onPress={zoomIn}
          activeOpacity={0.8}
          disabled={atMinZoom}
        >
          <LinearGradient
            colors={atMinZoom ? ['#555', '#333'] : ['#BE9E77', '#633D0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.zoomBtnGrad,
              atMinZoom && styles.zoomBtnGradDisabled,
            ]}
          >
            <Text style={styles.zoomBtnTxt}>+</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* − */}
        <TouchableOpacity
          style={[styles.zoomBtnTouch, { marginTop: 10 }]}
          onPress={zoomOut}
          activeOpacity={0.8}
          disabled={atMaxZoom}
        >
          <LinearGradient
            colors={atMaxZoom ? ['#555', '#333'] : ['#BE9E77', '#633D0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.zoomBtnGrad,
              atMaxZoom && styles.zoomBtnGradDisabled,
            ]}
          >
            <Text style={styles.zoomBtnTxt}>−</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* затемнённый фон под карточкой (чтобы кликом закрыть) */}
      {current && (
        <TouchableWithoutFeedback onPress={closeSpot}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* попап-карточка */}
      {current && (
        <View style={styles.popup}>
          <SpotCard
            spot={current}
            onClose={closeSpot}
            onReadMore={() =>
              nav.navigate('LocationDetails', { spot: current })
            }
          />
        </View>
      )}

      {/* Хедер как в других экранах */}
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
          <Text style={styles.headerTitle}>Map</Text>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

/* ---------- размеры UI ---------- */
const PILL_W  = 150;
const PILL_H  = 52;
const PIN_W   = 28;  // уменьшенный пин
const PIN_H   = 36;  // подгони под пропорцию png
const ZOOM_SIZE = 44; // размер квадратных кнопок зума

/* ---------- Стили ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map:       { ...StyleSheet.absoluteFillObject },

  /* уменьшенный пин */
  pinImg: {
    width: PIN_W,
    height: PIN_H,
    resizeMode: 'contain',
  },

  /* HEADER */
  headerWrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_H,
  },
  backBtn: { padding: 20 },
  backIcon:{ width: 24, height: 24, resizeMode: 'contain' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    left: -20,
  },

  /* блок зума (нижний правый угол) */
  zoomWrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,          // базово если нет карточки
    zIndex: 9,           // ниже хедера (10), выше карты
    alignItems: 'center',
  },
  // когда карточка открыта, поднимаем чуть выше, чтобы не закрылась
  zoomWrapRaised: {
    bottom: 280,         // подстрои при необходимости
  },
  zoomBtnTouch: {
    width: ZOOM_SIZE,
    height: ZOOM_SIZE,
    borderRadius: ZOOM_SIZE / 2,
    overflow: 'hidden',
  },
  zoomBtnGrad: {
    flex: 1,
    borderRadius: ZOOM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBtnGradDisabled: {
    opacity: 0.5,
  },
  zoomBtnTxt: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  /* overlay затемнение под карточкой (не под хедером) */
  overlay: {
    position: 'absolute',
    top: 60,  // под шапкой
    left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 5,
  },

  /* попап-карточка */
  popup: {
    position: 'absolute',
    bottom: 80,
    left: (width - POPUP_W) / 2,
    width: POPUP_W,
    zIndex: 10,
  },

  /* картачка-обёртка */
  cardWrap: {
    width: POPUP_W,
    backgroundColor: 'transparent',
  },

  /* рамка поверх */
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4E0202',
    zIndex: 2,
  },

  /* внутреннее содержимое */
  cardInner: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#262626',
  },

  cardPhoto: {
    width: '100%',
    height: 130,
  },

  /* кнопка закрытия в кружке */
  cardCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  cardCloseIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  /* (оставлено про запас) */
  cardCloseTxt: {
    fontSize: 22,
    lineHeight: 22,
    marginTop: -1,
  },

  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardTitleLine: {
    height: 2,
    backgroundColor: '#fff',
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 1,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  cardMug: {
    width: 22,
    height: 22,
    marginRight: 4,
    resizeMode: 'contain',
  },

  cardBtnTouch: {
    width: PILL_W,
    height: PILL_H,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBtnGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
