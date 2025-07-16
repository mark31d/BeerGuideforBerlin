// Components/HomeScreen.js
import React from 'react';
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

export default function HomeScreen() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { minHeight: height }]}
      >
        {/* Logo + Title */}
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

        <Image
          source={require('../assets/guide.png')}
          style={styles.maxImg}
          resizeMode="contain"
        />

        {/* Bottom card with Max + map snippet */}
        <View style={styles.card}>
          <Image
            // (плейсхолдер, без source как было в вашем коде)
            style={styles.maxImgContainer}
            resizeMode="contain"
          />
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>
              Don't waste time, open the interactive map and view all the places.
            </Text>

            {/* Нажимаемая мини-карта */}
            <TouchableOpacity
              style={styles.mapWrapper}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => navigation.navigate('MapScreen')}
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

function AppButton({ text, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonActive, // при нажатии
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.buttonText,
            pressed && styles.buttonTextActive, // можно и текст подсветить
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // чёрный фон
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  /* header */
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: -50,
    marginTop: -60,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },

  /* buttons */
  buttons: {},
  button: {
    backgroundColor: '#262626',
    paddingVertical: 16,
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
    fontSize: 16,
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
    padding: 20,
    alignItems: 'center',
    top: -15,
    width: 325,
  },
  maxImg: {
    width: 150,
    height: 230,
    marginRight: 16,
    marginBottom: -200,
    zIndex: 1,
    left: -24,
    top: -20,
  },
  maxImgContainer: {
    width: 100,
    height: 210,
    marginRight: 16,
    marginBottom: -210,
    zIndex: 1,
    left: -24,
  },
  cardBody: {
    flex: 1,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  mapWrapper: {
    width: '100%',
    height: 80,
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
