// App.js — entry point for **Beer Guide for Berlin**
// Every screen / context lives in `./Components/`

import React from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* ─── shared contexts ───────────────────────────── */
import { SavedProvider } from './Components/SavedContext';

/* ─── screens ───────────────────────────────────── */
import Loader            from './Components/Loader';            // splash / first-run
import Onboarding        from './Components/Onboarding';        // three-slide intro
import HomeScreen        from './Components/HomeScreen';        // main menu with big buttons
import RecommendedList   from './Components/RecommendedList';   // «Recommended places to visit»
import SavedList         from './Components/SavedList';         // «Saved places to visit»
import FactsScreen       from './Components/FactsScreen';       // «Facts about beer»
import LocationDetails   from './Components/LocationDetails';   // full card of a place
import MapScreen         from './Components/MapScreen';         // interactive map

/* ─── navigation setup ──────────────────────────── */
const Stack = createNativeStackNavigator();

/**
 * Экран-обёртка для Loader.
 * Получает navigation проп от Stack и передаёт в Loader колбэк onFinish.
 * Так мы избежим «мигающего» ребилда всего приложения.
 */
function LoaderScreen({ navigation }) {
  return (
    <Loader
      delay={6500}      // мс ожидания (анимация Loader); настрой как нужно
      fadeMs={300}      // плавное исчезновение (см. обновлённый Loader.js)
      onFinish={() => {
        navigation.replace('Onboarding');
      }}
    />
  );
}

export default function App() {
  /* тёмная тема — чёрные подложки, белый текст */
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000', // главный фон
      card:       '#000',
      text:       '#FFF',
      primary:    '#BE9E77', // не критично, но приятно
      border:     '#000',
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <NavigationContainer theme={theme}>
        <SavedProvider>
          <Stack.Navigator
            initialRouteName="Loader"   // ← стартовый экран
            screenOptions={{
              headerShown: false,
              animation: 'none',         // без промежуточной анимации (можно поменять на 'fade')
              contentStyle: { backgroundColor: '#000' }, // чёрная подложка между переходами
            }}
          >
            
            {/* Splash → Onboarding */}
            <Stack.Screen name="Loader"          component={LoaderScreen} />
            <Stack.Screen name="Onboarding"      component={Onboarding} />
            
            {/* Основные экраны */}
            <Stack.Screen name="Home"            component={HomeScreen} />
            <Stack.Screen name="RecommendedList" component={RecommendedList} />
            <Stack.Screen name="SavedList"       component={SavedList} />
            <Stack.Screen name="FactsScreen"     component={FactsScreen} />
            <Stack.Screen name="MapScreen"       component={MapScreen} />
            <Stack.Screen name="LocationDetails" component={LocationDetails} />
          
          </Stack.Navigator>
        </SavedProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
