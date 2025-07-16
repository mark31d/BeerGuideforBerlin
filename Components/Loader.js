// Components/Loader.js
import React, { useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, Image as RNImage } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Loader({ onFinish, delay = 1 }) {
  const mugUri = RNImage.resolveAssetSource(require('../assets/mug.png')).uri;

  useEffect(() => {
    if (!onFinish) return;
    const t = setTimeout(onFinish, delay);
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
    /* зеркально */
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
    50%     { 
      /* поднимаем на ту же высоту, но наклоняем влево */
      transform: scaleX(-1) translateY(-35px) rotateZ(10deg) translateX(8px);
    }
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg:   { flex: 1, justifyContent: 'center', alignItems: 'center' },

  logoContainer: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
  },
  logo:      { width: 160, height: 160 },
  guide:     {
    position: 'absolute',
    bottom: -440,
    width: '100%',
    aspectRatio: 0.55,
  },
  webWrap:   {
    position: 'absolute',
    bottom: 40,
    width: 240,
    height: 160,
  },
  webView:   { flex: 1, backgroundColor: 'transparent' , },
});
