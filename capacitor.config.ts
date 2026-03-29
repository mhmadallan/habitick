import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.habitick.app',
  appName: 'Habitick',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'habitick.api'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      androidSpinnerStyle: 'large',
      showSpinner: true,
      spinnerColor: '#999999'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
