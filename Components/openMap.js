// utils/openMap.js
import { Linking } from 'react-native';

export function openMapInBrowser(lat, lon, label = '') {
  const q = `${lat},${lon}`;
  const url = `https://www.google.com/maps?q=${q}${label ? `(${encodeURIComponent(label)})` : ''}`;
  Linking.openURL(url).catch(() => {
    Linking.openURL(`https://maps.google.com/?q=${q}`);
  });
}
