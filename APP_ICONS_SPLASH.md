# Creating Icons and Splash Screens

This guide covers creating app icons and splash screens for iOS and Android publication.

## Quick Option: Use Capacitor's Icon Generator

The easiest way is to use a single high-quality image (1024x1024px) and let tools generate all sizes.

### 1. Create Your Base Icon (1024 x 1024px)

**Design Requirements:**
- Square format (1:1 aspect ratio)
- No rounded corners (iOS and Android round them automatically)
- 200px+ safe zone from edges
- Solid colors work best (avoid gradients if possible)
- Must be memorable and distinct at 27x27px

**Design Tools:**
- Figma (free - figma.com)
- Canva (free - canva.com)
- Adobe Illustrator
- Sketch

**Save as:** PNG with transparency (icon-1024.png)

### 2. Generate All App Store Formats

Use free online tools to generate all required sizes:

#### Option A: Capacitor Icon Generator (Recommended)

```bash
npm install -g cordova-res
```

Place your 1024x1024 icon in `assets/icon.png` and splash (1280x1280) in `assets/splash.png`, then:

```bash
cordova-res --icon --splash
```

This generates all required sizes in `resources/`.

#### Option B: Online Tools

- **appicon.co** (appicon.co) - Upload once, download all sizes
- **nativebase.io** (nativebase.io/icon-converter) - Capacitor-specific
- **imageresizer.com** - Bulk resize tool

### 3. Required iOS Icon Sizes

Place these in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`:

```
Icon_16.png          16x16
Icon_20.png          20x20
Icon_29.png          29x29
Icon_32.png          32x32
Icon_40.png          40x40
Icon_58.png          58x58
Icon_60.png          60x60
Icon_76.png          76x76
Icon_80.png          80x80
Icon_87.png          87x87
Icon_120.png        120x120
Icon_152.png        152x152
Icon_167.png        167x167
Icon_180.png        180x180
Icon_1024.png      1024x1024
```

**Via Xcode:**
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select "App" project > "App" target > "Build Settings"
3. Search "App Icon"
4. Assets should auto-populate with proper sizes

### 4. Required Android Icon Sizes

Place these in `android/app/src/main/res/`:

```
mipmap-ldpi/ic_launcher.png       36x36
mipmap-mdpi/ic_launcher.png       48x48
mipmap-hdpi/ic_launcher.png       72x72
mipmap-xhdpi/ic_launcher.png      96x96
mipmap-xxhdpi/ic_launcher.png    144x144
mipmap-xxxhdpi/ic_launcher.png   192x192
```

**Plus Adaptive Icon (Android 8+):**
```
mipmap-*/ic_launcher_foreground.png  (same sizes)
```

### 5. Create Splash Screen (Optional but Recommended)

**Requirements:**
- Size: 1280 x 1280px (or 2560 x 2560px for retina)
- Should be your app logo/branding centered
- Safe area: 200px from all edges
- Background color matching your app theme

**Place in:**
- iOS: `ios/App/App/Assets.xcassets/Splash.imageset/`
- Android: `android/app/src/main/res/mipmap-*/splash.png`

**Splash Settings (in `capacitor.config.ts`):**
```javascript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,      // Show for 2 seconds
    launchAutoHide: true,           // Auto dismiss after duration
    androidScaleType: 'CENTER_CROP',
    showSpinner: false,
    spinnerColor: '#999999'
  }
}
```

## Automated Solution: cordova-res

The most reliable method is using the official Cordova resource generator:

```bash
# Install globally
npm install -g cordova-res

# Create asset directory structure
mkdir -p assets
# Place your 1024x1024 icon as: assets/icon.png
# Place your splash as: assets/splash.png

# Generate all sizes
cordova-res --icon --splash

# Will create resources/icon/ and resources/splash/ with all required sizes
```

**Then copy generated files:**
```bash
# iOS
cp resources/icon/ios/* ios/App/App/Assets.xcassets/AppIcon.appiconset/
cp resources/splash/ios/* ios/App/App/Assets.xcassets/Splash.imageset/

# Android
cp resources/icon/android/* android/app/src/main/res/
cp resources/splash/android/* android/app/src/main/res/
```

## Design Best Practices

1. **Simplicity** - Your icon should be recognizable at 27x27px
2. **Consistency** - Use same colors/style as your brand
3. **Contrast** - Ensure visibility on both light and dark backgrounds
4. **Avoid Photos** - Use illustrations or geometric shapes instead
5. **Test at Small Sizes** - Zoom out to 50% and verify clarity

## Colors for Habitick

Suggested icon colors based on your app theme:
- **Primary:** Blue (#3b82f6 from your Tailwind config)
- **Accent:** White or light slate (#e2e8f0)
- **Dark mode:** Works well with modern, clean icons

## Troubleshooting

**Icons not showing in Xcode:**
- Right-click AppIcon.appiconset > Delete
- Drag new icon files into Assets.xcassets
- Let Xcode auto-organize

**Android won't recognize icons:**
- Verify file names match exactly
- Use PNG format
- Check XML configuration in AndroidManifest.xml

**Splash screen cutting off:**
- Increase safe zone padding to 250px
- Use CENTER_CROP scaling in capacitor.config.ts
- Test on multiple device sizes

## Next Steps

1. Design your 1024x1024 icon
2. Generate all sizes using cordova-res
3. Add to both iOS and Android projects
4. Build and test on devices
5. Verify appearance in App Store/Play Store previews

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Google Material Design Icons](https://material.io/design/iconography/)
- [Capacitor Icon/Splash Docs](https://capacitorjs.com/docs/guides/splash-screens-and-icons)
- Free Icon Design: Canva, Adobe Express, Figma

---

**Estimated Time:** 1-2 hours (including design + generation)
