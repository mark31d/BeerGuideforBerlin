// Components/FactsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_BORDER  = 16;

// ⛳ ВРЕМЕННО: блокировка 10 секунд (для теста).
// Верни 24 * 60 * 60 * 1000, когда закончишь отладку.
const LOCK_DURATION = 24 * 60 * 60 * 1000;

// ассеты
const IMG_MAX    = require('../assets/guide.png');
const IMG_MUG    = require('../assets/mug.png');
const IMG_CLOCK  = require('../assets/clock.png');
const ICON_BACK  = require('../assets/BackArrow.png');

/* ------------------ ДАННЫЕ ------------------ */
const FACTS = [
  { id: '1',  text: `Beer is one of the oldest drinks in the world.
Its history dates back over 7,000 years — the Sumerians were brewing something similar to beer back in Mesopotamia.`, mugs: 2 },
  { id: '2',  text: `In ancient Egypt, beer was a form of salary.
Egyptian workers were often paid in beer — up to 4 liters per day!`, mugs: 2 },
  { id: '3',  text: `IPA did not originate in America.
India Pale Ale was created in Britain in the 18th century — beer with additional hops was better preserved during long sea voyages to India.`, mugs: 2 },
  { id: '4',  text: `Germany has a “Beer Law.”
“Reinheitsgebot” (1516) is the oldest law on product purity, allowing beer to be brewed only from water, barley, and hops.`, mugs: 2 },
  { id: '5',  text: `The Czech Republic is the #1 country in beer consumption.
On average, a Czech drinks 140+ liters of beer per year, the most in the world.`, mugs: 2 },
  { id: '6',  text: `Beer heads are scientists.
“Cymology” is the official science of brewing, and a scientist is called a “cymologist.”`, mugs: 2 },
  { id: '7',  text: `The Guinness World Record for a beer mug is 50 liters.
The largest beer mug was made in Germany — it holds almost 50 liters of beer.`, mugs: 2 },
  { id: '8',  text: `There are over 100 styles of beer.
From lager to lambic, from stout to saison — each style has its own unique yeast, fermentation, and flavor.`, mugs: 2 },
  { id: '9',  text: `The first brewers were women.
In the ancient world, brewing was a woman’s business. They were even considered the priests of beer.`, mugs: 2 },
  { id: '10', text: `Dark beer is not always stronger.
The color of beer does not indicate alcohol content — the dark color often comes from roasted malt, not from strength.`, mugs: 2 },
  { id: '11', text: `Beer bottles are dark for a reason.
Dark glass protects beer from ultraviolet light, which spoils the flavor.`, mugs: 2 },
  { id: '12', text: `Belgium has over 1,500 beers.
And most are served in a signature glass designed specifically for that type of beer.`, mugs: 2 },
  { id: '13', text: `Hops are a relative of hemp.
They belong to the same family, Cannabaceae.`, mugs: 2 },
  { id: '14', text: `Beer in space?
Yes, several breweries have already experimented with fermenting beer in zero gravity.`, mugs: 2 },
  { id: '15', text: `Beer was once considered safer than water.
In the Middle Ages, unsanitary conditions often made water unsafe to drink—beer was considered “purified” by boiling during the brewing process.`, mugs: 2 },
  { id: '16', text: `The word “brewer” has common roots in many languages.
English brew, German brauen, French brasser — all come from Old High German.`, mugs: 2 },
  { id: '17', text: `Beer was part of the Apollo astronauts’ diet.
But not in liquid form—in the form of special food tablets with beer flavorings.`, mugs: 2 },
  { id: '18', text: `Belgian monks are the gurus of brewing.
Some monasteries have been brewing beer for over 800 years. The most famous are Trappist beers.`, mugs: 2 },
  { id: '19', text: `Stout and porter are almost brothers.
Stout originated as a “stout porter” — that is, a stronger version of porter. Over time, it has evolved into a separate style.`, mugs: 2 },
  { id: '20', text: `Beer is the most popular alcohol in the world.
Over 35% of all alcohol consumed in the world is beer. That’s more than wine and spirits combined.`, mugs: 2 },
];

/* ------------------ ПОДКОМПОНЕНТЫ ------------------ */

// Intro (Go!)
function IntroCard({ onGo }) {
  return (
    <View style={styles.cardRow}>
      {/* Герой внутри карточки; обрезка вне границ за счёт overflow:hidden у cardRow */}
      <Image source={IMG_MAX} style={styles.cardMax} resizeMode="contain" />

      <View style={styles.cardContent}>
        <Text style={styles.cardRowText}>
          Want to get an interesting fact? Go ahead, but keep in mind that the next one will be available in 24 hours.
        </Text>
        <View style={styles.cardContentBtnSpacer}>
          <TouchableOpacity onPress={onGo} activeOpacity={0.8}>
            <LinearGradient
              colors={['#BE9E77', '#633D0F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.pillBtn}
            >
              <Text style={styles.pillBtnTxt}>Go!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Оверлей-бордер поверх картинки */}
      <View pointerEvents="none" style={styles.cardRowBorder} />
    </View>
  );
}

// Locked (таймер)
function LockedCard({ timerText }) {
  return (
    <View style={styles.cardRow2}>
      <Image source={IMG_MAX} style={styles.cardMax2} resizeMode="contain" />

      <View style={styles.cardContent}>
        <Text style={styles.cardRowText}>The following fact is available:</Text>
        <View style={styles.cardContentBtnSpacer}>
          <LinearGradient
            colors={['#BE9E77', '#633D0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.timerPill}
          >
            <Image source={IMG_CLOCK} style={styles.timerPillIcon} resizeMode="contain" />
            <Text style={styles.timerPillTxt}>{timerText}</Text>
          </LinearGradient>
        </View>
      </View>

      <View pointerEvents="none" style={styles.cardRowBorder} />
    </View>
  );
}

// Показ факта
function FactCard({ factText, onShare }) {
  return (
    <View style={styles.cardColumn}>
      <View style={styles.bigMugsWrap}>
        <Image source={IMG_MUG} style={[styles.bigMug, styles.bigMugLeft]} resizeMode="contain" />
        <Image source={IMG_MUG} style={[styles.bigMug, styles.bigMugRight]} resizeMode="contain" />
      </View>
      <Text style={styles.factCardText}>{factText}</Text>
      <View style={styles.factBtnSpacer}>
        <TouchableOpacity onPress={onShare} activeOpacity={0.8}>
          <LinearGradient
            colors={['#BE9E77', '#633D0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.pillBtn}
          >
            <Text style={styles.pillBtnTxt}>Share</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View pointerEvents="none" style={styles.cardColumnBorder} />
    </View>
  );
}

/* ------------------ ГЛАВНЫЙ КОМПОНЕНТ ------------------ */

export default function FactsScreen() {
  const nav = useNavigation();
  const [lastFetch, setLastFetch] = useState(null); // timestamp ms или null
  const [remainingMs, setRemainingMs] = useState(0);
  const [currentFact, setCurrentFact] = useState(null);

  // load last fetch time
  useEffect(() => {
    AsyncStorage.getItem('@lastFactTime').then(ts => {
      const t = ts ? parseInt(ts, 10) : null;
      setLastFetch(t);
    });
  }, []);

  // countdown
  useEffect(() => {
    if (!lastFetch) return;
    const tick = () => {
      const delta = Date.now() - lastFetch;
      const rem = LOCK_DURATION - delta;
      if (rem <= 0) {
        setLastFetch(null);
        setRemainingMs(0);
        AsyncStorage.removeItem('@lastFactTime');
      } else {
        setRemainingMs(rem);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastFetch]);

  const formatTime = ms => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600).toString().padStart(2, '0');
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(total % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleGo = () => {
    const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
    setCurrentFact(fact);
  };

  const handleShare = async () => {
    if (!currentFact) return;
    try {
      await Share.share({
        title: 'Fun beer fact',
        message: currentFact.text,
      });
      const now = Date.now().toString();
      await AsyncStorage.setItem('@lastFactTime', now);
      setLastFetch(Date.now());
      setCurrentFact(null);
    } catch (e) {
      console.warn('Share failed', e);
    }
  };

  const isLocked = !!lastFetch && !currentFact;

  return (
    <View style={styles.container}>
      {/* Header в стиле RecommendList */}
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
          <Text style={styles.headerTitle}>Facts about beer</Text>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLocked && <LockedCard timerText={formatTime(remainingMs)} />}
        {!isLocked && !currentFact && <IntroCard onGo={handleGo} />}
        {currentFact && <FactCard factText={currentFact.text} onShare={handleShare} />}
      </View>
    </View>
  );
}

/* ------------------ СТИЛИ ------------------ */
const CARD_WIDTH = width * 0.86; // не впритык к краям
const PILL_WIDTH  = 150;
const PILL_HEIGHT = 52;
const PILL_RADIUS = 10;

/* Параметры подрезки героя */
const HERO_WIDTH       = CARD_WIDTH * 0.48; // ширина исходного изображения
const HERO_CLIP_LEFT   = -24;               // сколько "за" левый край (отриц.) показываем
const HERO_CLIP_TOP    = -8;                // вверх
const HERO_CLIP_BOTTOM = -16;               // вниз
// внутреннее место для текста, чтобы не перекрывал герой
const HERO_SPACE = HERO_WIDTH * 0.75;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  /* HEADER */
  headerWrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  backBtn: { padding: 20  , marginTop:30,},
  backIcon: { width: 24, height: 24, resizeMode: 'contain', tintColor: '#fff' , },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    left: -20,
    marginTop:30,
  },

  /* CONTENT */
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  /* ОБЩЕЕ ДЛЯ ROW-КАРТОЧЕК (Intro / Locked) */
  cardRow: {
    width: CARD_WIDTH,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: CARD_BORDER,
    borderWidth: 0,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: HERO_SPACE,
    overflow: 'hidden',   // ★ КЛЮЧЕВОЕ: всё, что выходит за рамку, скрыто
  },
  cardRow2: {
    width: CARD_WIDTH,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: CARD_BORDER,
    borderWidth: 0,
    paddingTop: 70,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: HERO_SPACE,
    overflow: 'hidden',   // ★ КЛЮЧЕВОЕ: всё, что выходит за рамку, скрыто
  },

  /* Гид */
  cardMax: {
    position: 'absolute',
    left:-70,
    marginBottom:-50,
    width: 200,
    aspectRatio: 0.66,
    zIndex: 0,
    pointerEvents: 'none',
  },
  cardMax2: {
    position: 'absolute',
    left:-70,
    marginBottom:-50,
    width: 200,
    aspectRatio: 0.66,
    zIndex: 0,
    pointerEvents: 'none',
  },

  cardContent: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
  },
  cardRowText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',

  },
  cardContentBtnSpacer: {
    marginTop: 16,
  },

  /* Border overlay для row-карточек */
  cardRowBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: CARD_BORDER,
    borderWidth: 2,
    borderColor: '#4E0202',
    zIndex: 2,
  },

  /* ПИЛЮЛЬНЫЕ КНОПКИ */
  pillBtn: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

  /* Таймер-пилюля */
  timerPill: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_RADIUS,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:30,
  },
  timerPillIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#fff',
    
  },
  timerPillTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* КАРТОЧКА ФАКТА (колонка) */
  cardColumn: {
    width: CARD_WIDTH,
    position: 'relative',
    backgroundColor: '#262626',
    borderRadius: CARD_BORDER,
    borderWidth: 0,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden', // ★ тоже обрезаем всё наружу
  },
  cardColumnBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: CARD_BORDER,
    borderWidth: 2,
    borderColor: '#4E0202',
    zIndex: 2,
  },

  bigMugsWrap: {
    width: 140,
    height: 80,
    marginBottom: 24,
    position: 'relative',
  },
  bigMug: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  bigMugLeft: {
    left: -40,
    top: -30,
    transform: [{ scaleX: -1 }, { rotate: '20deg' }],
  },
  bigMugRight: {
    right: -40,
    top: -30,
    transform: [{ rotate: '20deg' }],
  },
  factCardText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  factBtnSpacer: {
    marginTop: 24,
  },
});
