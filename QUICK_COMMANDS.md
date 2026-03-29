# Quick Capacitor Commands Reference

## Daily Development

```bash
# Start web server
npm start

# Sync web code to mobile platforms
npm run mobile:sync

# Or sync specific platform
npx cap sync ios      # iOS only
npx cap sync android  # Android only
```

## Open Native IDEs

```bash
# Open iOS project in Xcode
npm run mobile:ios
# or
npx cap open ios

# Open Android project in Android Studio
npm run mobile:android
# or
npx cap open android
```

## First-Time Setup

```bash
# Install all dependencies
npm install

# Add iOS platform (creates ios/ folder)
npx cap add ios

# Add Android platform (creates android/ folder)
npx cap add android

# Install iOS pod dependencies
cd ios && pod install && cd ..
```

## Running on Devices

### iOS Simulator
```bash
# In Xcode: Product > Run (or ⌘ + R)
# OR via command line:
npx cap run ios
```

### iOS Physical Device
```bash
# Connect iPhone via USB
# In Xcode: Product > Run (or ⌘ + R)
# Select your device from the dropdown
```

### Android Emulator
```bash
# Make sure emulator is running, then:
npx cap run android
# OR click Play button in Android Studio
```

### Android Physical Device
```bash
# Connect Android phone via USB with debugging enabled
npx cap run android
# OR click Play button in Android Studio
```

## After Web Code Changes

```bash
# Quick workflow:
npm run mobile:sync          # Sync changes to native platforms
# Then rebuild in Xcode (⌘ + B) or Android Studio (Ctrl + B)
```

## Troubleshooting Commands

```bash
# Clean iOS build
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..

# Reset everything (removes native platforms)
rm -rf ios android
npx cap add ios
npx cap add android
cd ios && pod install && cd ..
```

## Checking Installation

```bash
# Verify Capacitor is installed
npx cap --version

# List available platforms
npx cap ls

# Check Android SDK/tools
npx cap run android --list # (from android directory)

# Check device connections
adb devices                 # Android
xcrun simctl list devices   # iOS
```

## Building for App Stores

```bash
# iOS (via Xcode)
# Product > Archive > Then distribute to App Store

# Android (via Android Studio or command line)
cd android
./gradlew bundleRelease  # For Google Play
./gradlew assembleRelease # For direct APK distribution
cd ..
# Find outputs in android/app/build/outputs/
```

## Common Issues Quick Fixes

```bash
# Pod install failed
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Gradle sync failed  
cd android && ./gradlew clean && cd ..

# JavaScript changes not showing
npm run mobile:sync
# Then rebuild in IDE

# Device not recognized
adb kill-server && adb start-server  # Android
# or restart Xcode                    # iOS
```

## Useful Capacitor Docs

- Full Docs: https://capacitorjs.com/docs
- Installation: https://capacitorjs.com/docs/getting-started
- APIs: https://capacitorjs.com/docs/apis
- Deploying: https://capacitorjs.com/docs/guides/deploying-to-app-stores

---

**Tip:** Keep this file handy during development! Bookmark it or pin it for quick reference.
