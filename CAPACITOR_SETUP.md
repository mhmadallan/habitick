# Capacitor Mobile App Setup Guide

This guide will help you convert your web app into native iOS and Android applications using Capacitor.

## Prerequisites

### Required Software
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**

### For iOS Development
- **Mac with macOS 12+**
- **Xcode 14+** - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - Install with: `sudo gem install cocoapods`

### For Android Development
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Java Development Kit (JDK) 11+** - Usually included with Android Studio
- **Android SDK** - Usually installed via Android Studio

## Installation & Setup

### 1. Install Capacitor CLI Globally (optional but recommended)

```bash
npm install -g @capacitor/cli
```

### 2. Install Dependencies

From the project root directory:

```bash
npm install
```

This will install:
- Capacitor Core and CLI
- Capacitor plugins for native features (SplashScreen, StatusBar, etc.)
- All other project dependencies

### 3. Initialize Capacitor

```bash
npx cap init
```

This has already been done for you with the configuration:
- App ID: `com.habitick.app`
- App Name: `Habitick`
- Web Directory: `public`

## Building the Web App

Your web app files are in the `public/` directory and are served by `server.js`. Make sure your app runs correctly in a browser first:

```bash
npm start
```

Visit `http://localhost:3000` and verify the app works properly.

## iOS Setup

### 1. Install iOS Platform

```bash
npx cap add ios
```

This creates the `ios/` folder with a complete Xcode project.

### 2. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 3. Open in Xcode

```bash
npx cap open ios
```

This will open the iOS project in Xcode. If it doesn't open automatically:
```bash
open ios/App/App.xcworkspace
```

**Important:** Always use the `.xcworkspace` file, not `.xcodeproj`.

### 4. Configure Signing (Required for Device Testing)

In Xcode:
1. Select the "App" project in the left sidebar
2. Select the "App" target
3. Go to the "Signing & Capabilities" tab
4. Select your team in the "Team" dropdown
5. Let Xcode auto-manage signing

### 5. Run on Device/Simulator

**On Simulator:**
- Build and run: ⌘ + R in Xcode, or press Play button

**On Physical Device:**
1. Connect your iPhone via USB/wireless
2. Select your device in the device dropdown
3. Press Play button in Xcode

### Code Updates During Development

When you make changes to your web files in `public/`:

```bash
npx cap sync ios
```

Then rebuild in Xcode (⌘ + B).

## Android Setup

### 1. Install Android Platform

```bash
npx cap add android
```

This creates the `android/` folder with a complete Android Studio project.

### 2. Open in Android Studio

```bash
npx cap open android
```

Or manually open: `File > Open > habitick/android`

### 3. Configure SDK & Java

Android Studio will prompt you to install missing components. Let it install:
- Android SDK
- Build Tools
- Android Emulator (if needed)

### 4. Run on Emulator

1. Create an Android Virtual Device (AVD):
   - In Android Studio: Tools > Device Manager
   - Click "Create device"
   - Choose a device type (Pixel 6, Pixel 7, etc.)
   - Choose Android version (API 30+)
   - Finish creation

2. Run the app:
   - Select your emulator in the device dropdown
   - Click the green Play button
   - Or use: `npx cap run android`

### 5. Run on Physical Device

1. Enable Developer Mode on your Android phone:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings > Developer options > USB Debugging > Enable

3. Connect via USB cable

4. In Android Studio:
   - Select your device in the device dropdown
   - Click Play button
   - Or use: `npx cap run android`

### Code Updates During Development

When you make changes to your web files in `public/`:

```bash
npx cap sync android
```

Then rebuild in Android Studio.

## Syncing Web Code to Native Apps

After making changes to files in `public/`:

**Sync both platforms:**
```bash
npm run mobile:sync
```

**Sync iOS only:**
```bash
npx cap sync ios
```

**Sync Android only:**
```bash
npx cap sync android
```

Then rebuild in Xcode or Android Studio.

## Accessing Native Features

Capacitor provides JavaScript APIs for:
- Camera
- Geolocation
- Device information
- Notifications
- File system
- And many more...

Example: Get device info in JavaScript
```javascript
import { Device } from '@capacitor/device';

const info = await Device.getInfo();
console.log('Device ID:', info.uuid);
```

See [Capacitor API Docs](https://capacitorjs.com/docs/apis) for all available features.

## Build Scripts Available

In `package.json`:
- `npm start` - Start web dev server
- `npm run build` - Sync web app to mobile platforms
- `npm run mobile:sync` - Same as build
- `npm run mobile:ios` - Open iOS project in Xcode
- `npm run mobile:android` - Open Android project in Android Studio

## Troubleshooting

### iOS Issues

**"Pod install failed"**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**"Device not found in Xcode"**
- Disconnect and reconnect the device
- Restart Xcode
- Check: Window > Devices and Simulators

### Android Issues

**"Gradle sync failed"**
- File > Sync Now in Android Studio
- Or: `cd android && ./gradlew clean && cd ..`

**"Device not found"**
```bash
adb devices
adb kill-server
adb start-server
```

**"Permission denied" on device**
- Uncheck "Android App Bundle" in Android Studio Run configuration
- Use APK format instead

## Building for App Stores

### iOS - App Store

```bash
# In Xcode
# Product > Archive
# Follow App Store distribution steps
```

### Android - Google Play

```bash
cd android
./gradlew build
# Use android/app/build/outputs/apk/ for signing
```

See [Capacitor Deployment Docs](https://capacitorjs.com/docs/guides/deploying-to-app-stores) for detailed steps.

## Next Steps

1. Test your app on both iOS and Android
2. Add app icons and splash screens
3. Implement push notifications
4. Build and publish to App Stores
5. Set up continuous deployment (CI/CD)

## Useful Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Guide](https://capacitorjs.com/docs/guides/deploying-to-app-stores#ios)
- [Android Development Guide](https://capacitorjs.com/docs/guides/deploying-to-app-stores#android)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [Android Studio Documentation](https://developer.android.com/studio)
