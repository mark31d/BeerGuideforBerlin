// App.js — entry point for **Beer Guide for Berlin**
// Every screen / context lives in `./Components/`

import React, { useState, useEffect }                 from 'react';
import { StatusBar }                                  from 'react-native';
import { NavigationContainer, DefaultTheme }          from '@react-navigation/native';
import { createNativeStackNavigator }                 from '@react-navigation/native-stack';
import { SafeAreaProvider }                           from 'react-native-safe-area-context';

/* ─── shared contexts ───────────────────────────── */
import { SavedProvider }  from './Components/SavedContext';

/* ─── screens ───────────────────────────────────── */
import Loader            from './Components/Loader';            // splash / first-run
import Onboarding        from './Components/Onboarding';        // three-slide intro
import HomeScreen        from './Components/HomeScreen';        // main menu with big buttons
import RecommendedList   from './Components/RecommendedList';   // «Recommended places to visit»
import SavedList         from './Components/SavedList';         // «Saved places to visit»
import FactsScreen       from './Components/FactsScreen';       // «Facts about beer»
import LocationDetails      from './Components/LocationDetails';      // full card of a place
import MapScreen         from './Components/MapScreen';         // interactive map

/* ─── navigation setup ──────────────────────────── */
const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  /* imitate initial loading */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 9200);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return <Loader />;

  /* dark theme that fits the beer-gold palette used in headers */
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000',   // page background
      card:       '#000',   // header background (our custom headers override colours)
      text:       '#FFF',
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <NavigationContainer theme={theme}>
        <SavedProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding"       component={Onboarding} />
            <Stack.Screen name="Home"             component={HomeScreen} />

  
            <Stack.Screen name="RecommendedList"  component={RecommendedList} />
            <Stack.Screen name="SavedList"        component={SavedList} />
            <Stack.Screen name="FactsScreen"      component={FactsScreen} />
            <Stack.Screen name="MapScreen"        component={MapScreen} />


            <Stack.Screen name="LocationDetails"     component={LocationDetails} />
          </Stack.Navigator>
        </SavedProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
