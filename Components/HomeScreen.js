import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { openMapInBrowser } from '../Components/openMap';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => makeStyles(width, height), [width, height]);

  // Кнопка внутри, чтобы styles был доступен
  const AppButton = ({ text, onPress, active, noRed }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        !noRed && (active || pressed) && styles.buttonActive,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.buttonText,
            !noRed && (active || pressed) && styles.buttonTextActive,
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );

  // Открыть обзорную карту Берлина (центр города)
  const openBerlinMap = () => {
    // Координаты центра Берлина
    openMapInBrowser(52.5200, 13.4050, 'Berlin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { minHeight: height }]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <AppButton
            text="Recommended places to visit"
            onPress={() => navigation.navigate('RecommendedList')}
            active
            noRed   // ← не красим первую кнопку
          />
          <AppButton
            text="Saved places to visit"
            onPress={() => navigation.navigate('SavedList')}
          />
          <AppButton
            text="Facts about beer"
            onPress={() => navigation.navigate('FactsScreen')}
          />
        </View>

        {/* Guide image */}
        <Image
          source={require('../assets/guide.png')}
          style={styles.maxImg}
          resizeMode="contain"
        />

        {/* Bottom card */}
        <View style={styles.card}>
          <Image style={styles.maxImgContainer} resizeMode="contain" />
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>
              Don't waste time, open the interactive map and view all the places.
            </Text>

            <TouchableOpacity
              style={styles.mapWrapper}
              activeOpacity={0.8}
              onPress={openBerlinMap}  // ← было navigation.navigate('MapScreen')
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                source={require('../assets/map_snippet.png')}
                style={styles.mapImg}
                resizeMode="cover"
              />
              <Image
                source={require('../assets/tap_icon.png')}
                style={styles.tapIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


/* ───────────────────────── STYLES ───────────────────────── */
function makeStyles(w, h) {
  const isSE  = (h <= 667 && w <= 375);   // iPhone SE
  const isMax = (h >= 926 || w >= 428);   // 15 Pro Max и т.п.

  const vw = w / 375;
  const rs = (s) => Math.round(s * vw);

  /* --- Лого --- */
  const LOGO_W  = isSE ? 200 : isMax ? 280 : 240;
  const LOGO_MB = isSE ? -36 : isMax ? -60 : -48;
  const LOGO_MT = isSE ? -40 : isMax ? -20 : -55;

  /* --- Кнопки --- */
  const BTN_VPAD = isSE ? 14 : 16;
  const BTN_FZ   = isSE ? 15 : 16;

  /* --- Карточка --- */
  const CARD_W   = isSE ? w * 0.86 : w * 0.92;
  const CARD_TOP = isSE ? -12 : isMax ? -85 : -40;
  const CARD_PAD = isSE ? 16 : 20;

  /* --- Guide image позиции --- */

  const GUIDE_LEFT = isSE ? -24 : isMax ? -25 : -4;
  const GUIDE_TOP  = isSE ? -20 : isMax ? -6 : -24;

  const MAX_W   = 150;
  const MAX_H   = 230;
  const MAX_MB  = -200;

  const MAP_H   = isSE ? 74 : 86;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: isSE ? 32 : 40,
      paddingBottom: 40,
      justifyContent: 'space-between',
    },

    /* header */
    header: {
      alignItems: 'center',
      marginBottom: isSE ? 24 : 32,
    },
    logo: {
      width: LOGO_W,
      height: LOGO_W,
      marginBottom: LOGO_MB,
      marginTop: LOGO_MT,
    },

    /* buttons */
    buttons: {},
    button: {
      backgroundColor: '#262626',
      paddingVertical: BTN_VPAD,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#AD2A2A',
      marginBottom: 16,
      alignItems: 'center',
    },
    buttonActive: {
      backgroundColor: '#AD2A2A',
    },
    buttonText: {
      color: '#fff',
      fontSize: BTN_FZ,
      fontWeight: '700',
    },
    buttonTextActive: {
      color: '#fff',
    },

    /* bottom card */
    card: {
      flexDirection: 'row',
      backgroundColor: '#262626',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#AD2A2A',
      padding: CARD_PAD,
      alignItems: 'center',
      top: CARD_TOP,
      width: CARD_W,
      alignSelf: 'center',
    },

    /* guide image */
    maxImg: {
      width: MAX_W,
      height: MAX_H,
      marginRight: 16,
      marginBottom: MAX_MB,
      zIndex: 1,
      left: GUIDE_LEFT,
      top: GUIDE_TOP,
    },
    maxImgContainer: {
      width: MAX_W * 0.67,
      height: MAX_H - 20,
      marginRight: 16,
      marginBottom: MAX_MB,
      zIndex: 1,
      left: -24,
    },

    cardBody: {
      flex: 1,
    },
    cardText: {
      color: '#fff',
      fontSize: isSE ? 13 : 14,
      marginBottom: 12,
      lineHeight: isSE ? 18 : 20,
    },
    mapWrapper: {
      width: '100%',
      height: MAP_H,
      borderRadius: 10,
      overflow: 'hidden',
    },
    mapImg: {
      flex: 1,
    },
    tapIcon: {
      position: 'absolute',
      width: 32,
      height: 32,
      top: '50%',
      left: '50%',
      marginTop: -16,
      marginLeft: -16,
    },
  });
}

