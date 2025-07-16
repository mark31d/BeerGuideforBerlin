// Components/SavedContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ключ для AsyncStorage — можно менять при изменении структуры
const STORAGE_KEY = '@saved_spots_v1';

export const SavedContext = createContext({
  saved: [],
  toggle: () => {},
});

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState([]);

  // при монтировании читаем из хранилища
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          setSaved(JSON.parse(data));
        }
      } catch (e) {
        console.warn('Failed to load saved spots:', e);
      }
    })();
  }, []);

  // сохраняет в AsyncStorage
  const persist = async (next) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist saved spots:', e);
    }
  };

  // добавляет или убирает spot из сохранённых
  const toggle = (spot) => {
    let next;
    if (saved.some((s) => s.id === spot.id)) {
      next = saved.filter((s) => s.id !== spot.id);
    } else {
      next = [spot, ...saved];
    }
    setSaved(next);
    persist(next);
  };

  return (
    <SavedContext.Provider value={{ saved, toggle }}>
      {children}
    </SavedContext.Provider>
  );
}
