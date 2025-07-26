// Components/Loader.js
import React, { useEffect, useMemo } from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Image as RNImage,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function Loader({ onFinish, delay = 1 }) {
  const mugUri = RNImage.resolveAssetSource(require('../assets/mug.png')).uri;
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => makeStyles(width, height), [width, height]);

  useEffect(() => {
    if (!onFinish) return;
    const t = setTimeout(onFinish, delay); // delay в мс, если нужно в секундах — умножь на 1000
    return () => clearTimeout(t);
  }, [onFinish, delay]);

  const html = `
<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
  html, body {
    margin:0; padding:0; width:100%; height:100%;
    background:transparent; overflow:hidden;
    display:flex; justify-content:center; align-items:flex-end;
  }
  .container {
    position: relative;
    width: 240px; height: 160px;
  }
  .mug {
    position: absolute;
    bottom: 0;
    width: 120px;
    transform-origin: center bottom;
  }
  .mug.l {
    left: 0;
    animation: bobLeft 2.4s infinite ease-in-out;
  }
  .mug.r {
    right: 0;
    transform: scaleX(-1);
    animation: bobRight 2.4s infinite ease-in-out;
  }
  .shadow {
    position: absolute;
    bottom: 8px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 8px;
    background: rgba(0,0,0,0.6);
    border-radius: 50%;
    filter: blur(2px);
    animation: shadowPulse 2.4s infinite ease-in-out;
  }
  @keyframes bobLeft {
    0%,100% { transform: translateY(0) rotateZ(0deg); }
    50%     { transform: translateY(-35px) rotateZ(10deg) translateX(8px); }
  }
  @keyframes bobRight {
    0%,100% { transform: scaleX(-1) translateY(0) rotateZ(0deg); }
    50%     { transform: scaleX(-1) translateY(-35px) rotateZ(10deg) translateX(8px); }
  }
  @keyframes shadowPulse {
    0%,100% { transform: translateX(-50%) scale(0.6); opacity:0.6; }
    50%     { transform: translateX(-50%) scale(1);   opacity:0.9; }
  }
</style>
</head>
<body>
  <div class="container">
    <img class="mug l" src="${mugUri}"/>
    <img class="mug r" src="${mugUri}"/>
    <div class="shadow"></div>
  </div>
</body></html>`;

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* логотип */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logoB.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* гид */}
        <Image
          source={require('../assets/guide.png')}
          style={styles.guide}
          resizeMode="contain"
        />

        {/* WebView с HTML-анимацией кружек */}
        <View style={styles.webWrap}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webView}
            scrollEnabled={false}
            androidLayerType="none"
          />
        </View>
      </ImageBackground>
    </View>
  );
}

/* ───────────────────────── STYLES ───────────────────────── */
function makeStyles(w, h) {
  const isSE  = (h <= 667 && w <= 375);     // iPhone SE/старые
  const isMax = (h >= 926 || w >= 428);     // 15 Pro Max и т.п.

  // Можно дополнительно использовать vw/vh, но здесь фиксируем ключевые сдвиги:
  const LOGO_W = isSE ? 140 : isMax ? 200 : 160;
  const LOGO_H = LOGO_W;
  const LOGO_TOP = isSE ? 32 : 40;

  // Гид (guide)
  // Твои значения:
  //  - SE: bottom: -440, aspectRatio: 0.55
  //  - Max: bottom: -440 + marginBottom: 130 (по факту сдвиг вверх)
  const GUIDE_BOTTOM = -440;
  const GUIDE_MB     = isMax ? 130 : 0; // только для Max добавляем marginBottom
  const GUIDE_AR     = 0.55;            // как у тебя

  // Блок с WebView
  const WEB_BOTTOM = isSE ? 32 : 40;
  const WEB_W = 240;
  const WEB_H = 160;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },
    bg:   { flex: 1, justifyContent: 'center', alignItems: 'center' },

    logoContainer: {
      position: 'absolute',
      top: LOGO_TOP,
      alignItems: 'center',
    },
    logo: { width: LOGO_W, height: LOGO_H },

    guide: {
      position: 'absolute',
      bottom: GUIDE_BOTTOM,
      width: '100%',
      aspectRatio: GUIDE_AR,
      marginBottom: GUIDE_MB,
    },

    webWrap: {
      position: 'absolute',
      bottom: WEB_BOTTOM,
      width: WEB_W,
      height: WEB_H,
    },
    webView: { flex: 1, backgroundColor: 'transparent' },
  });
}
