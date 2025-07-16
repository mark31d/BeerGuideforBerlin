// Components/Onboarding.js

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const slides = [
  {
    key: '1',
    title: "I'm Max – your guide to the world of Berlin beer.",
    text:
      'From classic beer halls to innovative craft bars – together we will discover the most delicious and atmospheric places in the capital.',
    img: require('../assets/guide.png'),
  },
  {
    key: '2',
    title:
      'I’ll show you the best beer spots, help you save your favorite places and find your way to new discoveries on the interactive map.',
    text: 'Click → and set off on a journey with taste!',
    img: require('../assets/onb_2.png'),
  },
  {
    key: '3',
    title: 'Learn interesting facts about beers, traditions and ingredients.',
    text: "I'll tell you what to try and where! Ready for a beer adventure?",
    img: require('../assets/onb_2.png'),
  },
];

export default function Onboarding() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      {/* прозрачный статус-бар */}
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <FlatList
        ref={ref => (flatListRef.current = ref)}
        data={slides}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <ImageBackground
            source={require('../assets/bg_onboarding.png')}
            style={[styles.bg, { width, height:820}]}
            resizeMode="cover"
          >
            {/* Персонаж Max */}
            <Image
              source={item.img}
              style={[styles.hero, { height: height * 0.78 }]}
              resizeMode="contain"
            />

            {/* Текстовая карточка с рамкой */}
            <View style={[styles.cardWrap, { width: width * 0.87 }]}>
              <View style={styles.cardInner}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </View>

            {/* Кнопка «Далее» */}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={styles.nextBtn}
            >
              <Image
                source={require('../assets/arrow.png')}
                style={styles.nextIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </ImageBackground>
        )}
      />
    </View>
  );
}

const BORDER_RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  bg: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  hero: {
    position: 'absolute',
    top: -10,
    width: '100%',
    left: -10,
  },

  cardWrap: {
    position: 'absolute',
    bottom: 230,
    alignSelf: 'center',
    alignItems: 'center',
  },

  cardInner: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS,
    padding: 20,

    // вот здесь наносим рамку
    borderWidth: 2,
    borderColor: '#4E0202',
  },

  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  text: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  nextBtn: {
    position: 'absolute',
    bottom: 165,
    alignSelf: 'center',
  },

  nextIcon: {
    width: 200,
    height: 58,
  },
});
