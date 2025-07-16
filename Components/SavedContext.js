import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SPOTS } from './spots';

// 1. Собираем *все* споты в один индекс по id
const ALL_SPOTS_ARRAY = Object.values(SPOTS).flat(); // [category1..., category2...]
const SPOT_INDEX = ALL_SPOTS_ARRAY.reduce((acc, spot) => {
  acc[spot.id] = spot;
  return acc;
}, {});

// Ключ в AsyncStorage
const STORAGE_KEY = '@saved_spot_ids_v2'; // ⚠️ новый ключ (v2), чтобы не конфликтовать со старым форматом

export const SavedContext = createContext({
  saved: [],      // массив *полных* объектов (re-hydrated)
  toggle: () => {}, // toggle(spot)
  isSaved: () => false, // isSaved(id)
});

export function SavedProvider({ children }) {
  const [ids, setIds] = useState([]); // внутреннее состояние: только id

  // 2. Ре-гидратация: по ids получаем объекты
  const saved = useMemo(() => ids.map(id => SPOT_INDEX[id]).filter(Boolean), [ids]);

  // 3. Загрузить ids при старте
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setIds(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to load saved spots:', e);
      }
    })();
  }, []);

  // 4. Persist helper
  const persist = async (nextIds) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    } catch (e) {
      console.warn('Failed to persist saved spot ids:', e);
    }
  };

  // 5. Toggle по споту (или объекту с id)
  const toggle = useCallback((spot) => {
    if (!spot?.id) return;
    setIds(prevIds => {
      const exists = prevIds.includes(spot.id);
      const nextIds = exists
        ? prevIds.filter(x => x !== spot.id)
        : [spot.id, ...prevIds]; // добавляем в начало
      // persist синхронно по итогу
      persist(nextIds);
      return nextIds;
    });
  }, []);

  // быстрый хелпер
  const isSaved = useCallback((id) => ids.includes(id), [ids]);

  return (
    <SavedContext.Provider value={{ saved, toggle, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}
