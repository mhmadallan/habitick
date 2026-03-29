# Build & Release Guide

Complete step-by-step instructions for building release versions of Habitick and submitting to app stores.

---

# iOS BUILD & SUBMISSION

## Step 1: Final Preparations

### 1.1 Update Version Number

In Xcode:

1. Open `ios/App/App.xcworkspace`
2. Select "App" project > "App" target
3. Go to "General" tab
4. Update "Version" (e.g., 1.0.0)
5. Update "Build" number (increment by 1 each time)

### 1.2 Verify Signing Configuration

1. Select "App" project > "App" target
2. Go to "Signing & Capabilities" tab
3. Ensure:
   - "Automatically manage signing" is **checked**
   - Team is selected
   - Bundle ID is `com.habitick.app`
   - Any errors are resolved (red X icons)

### 1.3 Sync Latest Web Code

```bash
npm run mobile:sync
```

### 1.4 Update App Icons & Splash

If you've created new icons:

```bash
# Copy icon file to iOS assets
cp icon-1024.png ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

## Step 2: Create Archive

In Xcode:

1. Select "Product" > "Scheme" > "App"
2. Select "Product" > "Destination" > Generic iOS Device (not simulator)
3. Select "Product" > "Archive"
4. Wait for build to complete (2-5 minutes)
5. Xcode should open "Organizer" window showing your archive

**If archive fails:**
```bash
# Clean build
cd ios/App
xcodebuild clean
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release
cd ../..
```

## Step 3: Distribute to App Store

In Xcode Organizer window (after archive completes):

1. Select your latest archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Click "Next"
5. Select "Upload"
6. Select "Automatically manage signing"
7. Click "Next"
8. Review summary
9. Click "Upload"

**Status messages:**
- "Preparing to upload..." - Processing build
- "Uploading..." - Transferring to Apple servers
- "Complete" - Upload successful

Takes 1-5 minutes.

## Step 4: Set Up App Store Connect

Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

### 4.1 Create App (First Time Only)

1. Click "Apps" > "+" > "New App"
2. Select "iOS"
3. Fill in:
   - **Name:** Habitick
   - **Primary Language:** English
   - **Bundle ID:** com.habitick.app (select from dropdown)
   - **SKU:** habitick (unique identifier)
   - **User Access:** Your role should auto-select
4. Click "Create"

### 4.2 Add App Information

1. Go to "App Information" section
2. Fill in:
   - **Privacy Policy URL:** Your privacy policy link
   - **Support URL:** GitHub or your support page
   - **Marketing URL:** Your website (optional)
   - **App Category:** Productivity
   - **Age Rating:** Work through rating questionnaire

### 4.3 Add Screenshots

1. Go to "App Preview and Screenshots"
2. For each device size (iPhone 15, 12, SE):
   - Click "+" to add screenshots
   - Upload 2-5 screenshots (required for each device type)
   - Add captions if desired
   - Order them: Home > Features > Benefits
3. Screenshots must be 1170x2532px (iPhone) format

### 4.4 Fill in Metadata

**On App Store** tab:

1. **Subtitle:** "Daily Habit Tracker"
2. **Description:** Copy from [APPSTORE_ASSETS.md](./APPSTORE_ASSETS.md)
3. **Keywords:** "habit tracker, daily habits, productivity, goal setting"
4. **Support URL & Privacy Policy:** Links to your sites
5. **View on App Store button:** Preview how it looks

### 4.5 Add Build

1. Go to "Build" section
2. Click "+"
3. Wait for your uploaded build to appear (may take 5-15 minutes)
4. Select it when ready
5. Complete any additional information required

### 4.6 Submit for Review

1. Go to "App Overview" or "Submission" section
2. Review all information is complete (no red ! marks)
3. Click "Submit for Review"
4. Answer final compliance questions
5. Confirm submission

**Review time:** 24-48 hours typically

---

# ANDROID BUILD & SUBMISSION

## Step 1: Final Preparations

### 1.1 Update Version Numbers

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.habitick.app"
        minSdkVersion 26      // API 26 (Android 8.0)
        targetSdkVersion 34   // Latest SDK
        versionCode 1         // Increment for each release
        versionName "1.0.0"   // Semantic version
    }
}
```

**Important:** `versionCode` **must** increase for each update!

### 1.2 Verify Signing Configuration

Check `android/app/build.gradle` has signing config (see [CERTIFICATES_SIGNING.md](./CERTIFICATES_SIGNING.md)):

```gradle
signingConfigs {
    release {
        keyAlias 'habitick'
        keyPassword 'YOUR_PASSWORD'
        storeFile file('keystore/habitick-release.keystore')
        storePassword 'YOUR_KEYSTORE_PASSWORD'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

### 1.3 Sync Latest Web Code

```bash
npm run mobile:sync
```

## Step 2: Build Release Bundle

Building App Bundle (AAB) for Google Play is the recommended approach:

```bash
cd android

# Clean (optional but recommended)
./gradlew clean

# Build App Bundle
./gradlew bundleRelease

cd ..
```

**Output:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Expected size:** 15-25 MB

**Build time:** 3-5 minutes

### Alternative: Build APK (Direct Installation)

Only use APK if you want direct distribution:

```bash
cd android
./gradlew assembleRelease
cd ..
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Step 3: Verify Build Integrity

### 3.1 Check App Bundle

```bash
# Install bundletool
npm install -g @react-native-community/cli-platform-android

# OR download from Google:
# https://developer.android.com/studio/command-line/bundletool

# Verify bundle
bundletool validate --bundle-path=android/app/build/outputs/bundle/release/app-release.aab
```

Should show: `Bundle is valid.`

### 3.2 Check APK Signature

If built APK:

```bash
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk
```

Should show: `jar verified`

## Step 4: Set Up Google Play Developer Account

[Google Play Developer Console](https://play.google.com/console)

### Account Setup (First Time)

1. Sign in with Google account
2. Pay $25 developer fee (one-time)
3. Accept Developer Agreement
4. Complete identity verification
5. Set up billing (if offering in-app purchases)

### Create App Listing

1. Click "Create app"
2. Enter:
   - **App name:** Habitick
   - **Default language:** English
   - **App or game:** App
3. Accept policy
4. Click "Create app"

## Step 5: Add App Details

### 5.1 App Information

In console, navigate to "App information":

1. **App name:** Habitick (50 chars max)
2. **Developer name:** Your name/company
3. **Email address:** Your contact email
4. **Privacy policy:** Link to your privacy policy
5. **Category:** Productivity

### 5.2 App access

If none: "This app is not designed to be accessed by children"

### 5.3 Test Instructions

Leave blank or add: "Sign in with any Google account to test"

## Step 6: Add Store Listing

In console, go to "App listings" section:

### 6.1 Main Store Listing

Fill in:

1. **Short description** (80 chars):
   ```
   Track daily habits & achieve goals with AI-powered encouragement
   ```

2. **Full description** (4000 chars):
   Copy from [APPSTORE_ASSETS.md](./APPSTORE_ASSETS.md)

3. **App preview video** (optional)

4. **Graphics:**
   - **Icon:** 512x512 PNG/JPEG
   - **Feature graphic:** 1024x500 PNG/JPEG
   - **Screenshots:** 1080x1920px (2-8 required)

### 6.2 Content Ratings

1. Click "Content rating questionnaire"
2. Provide answers (for habit tracker, mostly "None"):
   - Violence: None
   - Sexual content: None
   - Profanity: None
   - Alcohol/tobacco/drugs: None
3. Submit questionnaire
4. Continue to rating

### 6.3 Audience & Content

- **Target age:** 4+ (or adjust for your app)
- **Ads:** No (if true)
- **In-app purchases:** No (if true)

## Step 7: Add Release

### 7.1 Create Release

1. Go to "Release management" > "Releases"
2. Click "Create new release"
3. Select "Production" (not Internal Testing)
4. Click "Add release notes"
5. Enter version notes:
   ```
   Version 1.0.0 - Initial Release
   
   Features:
   • Track daily habits with custom frequencies
   • AI-powered encouragement
   • Progress analytics
   • Dark mode support
   ```
6. Click "Review"

### 7.2 Add App Bundle/APK

1. Under "App bundles & APKs"
2. Click "Add bundle (AAB)" or "Add APK"
3. Upload your `app-release.aab` (or `.apk`)
4. Wait for processing (1-2 minutes)
5. Should show no errors

### 7.3 Rollout Percentage

For first release:
- Select "20%" or "50%" to start
- Can increase gradually after ~1 day of monitoring
- Eventually push to 100%

Or start with 100% if confident.

### 7.4 Review Release

1. Check all information is complete
2. No red ! icons
3. Click "Review release"
4. Final check
5. Click "Start rollout to Production"

**Status:** "Preparing release..." → "Rolled out to Production"

Takes typically 2-4 hours to appear on Google Play.

## Step 8: Monitor Releases

### After Submission

1. Go to "Release management" > "Releases"
2. Watch status of your release
3. Check for any crashes reported:
   - Go to "Quality" > "Crashes & ANRs"
4. Monitor user reviews in "Ratings & reviews"

### Common Issues

**"Upload failed - APK signature invalid"**
- Verify signing configuration
- Rebuild and check integrity

**"Duplicate permission declaration"**
- Remove duplicate permissions from AndroidManifest.xml
- Rebuild

**"Minimum API level too low"**
- Update targetSdkVersion to 34+
- Rebuild

---

# POST-SUBMISSION

## iOS App Store Review

**Timeline:** 24-48 hours typically

Once submitted:

1. You'll receive email "Your app has been reviewed"
2. Either:
   - **Approved:** "Ready for Sale" - App goes live immediately
   - **Rejected:** Reasons provided - Fix and resubmit

**Common rejection reasons:**
- Privacy policy missing
- Metadata inaccurate
- Performance issues
- Policy violations

Fix issues and resubmit (starts new review).

## Google Play Store Review

**Timeline:** 2-4 hours typically

After rollout:

1. App appears on Google Play
2. Monitor crashes & ANRs
3. Read user reviews
4. Update as needed

Can roll back with:
1. Release management
2. Click release
3. "Manage release" > "Roll back"

---

# UPDATES & MAINTENANCE

## How to Release Updates

### For iOS

1. Make changes to web code
2. Bump version in Xcode:
   - Version → e.g., 1.0.0 → 1.0.1
   - Build → 2, 3, 4, etc.
3. Build archive
4. Upload via App Store Connect
5. Wait for review

**Can take 1-2 updates before review is faster (Apple learns your app).**

### For Android

1. Make changes to web code
2. Update versionCode in build.gradle (e.g., 1 → 2)
3. Update versionName (e.g., 1.0.0 → 1.0.1)
4. Build bundle: `./gradlew bundleRelease`
5. Upload via Google Play Console
6. Publish

**Usually goes live within 2-4 hours.**

---

# VERSIONING STRATEGY

Use Semantic Versioning: `MAJOR.MINOR.PATCH`

```
1.0.0  Initial release
1.0.1  Bug fixes
1.1.0  New features
2.0.0  Major rewrite/breaking changes
```

**Android versionCode:** Just use 1, 2, 3...
**iOS Build:** Same or auto-increment

---

# RELEASE CHECKLIST

Before hitting publish:

### Final Technical Check

- [ ] No console errors
- [ ] No crash reports
- [ ] API connectivity verified
- [ ] All features tested
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Version numbers correct
- [ ] Changelog prepared
- [ ] Build signed and verified

### Store Metadata

- [ ] Screenshots uploaded (all required sizes)
- [ ] Icons included (correct dimensions)
- [ ] Description complete & accurate
- [ ] Privacy policy link works
- [ ] Category selected
- [ ] Age rating completed
- [ ] Support info provided

### Submission

- [ ] Final review of everything
- [ ] No placeholder text
- [ ] No test data
- [ ] Not testing in production
- [ ] Ready for public

---

# TROUBLESHOOTING

## iOS Issues

**"Build failed - CodeSign error"**
```bash
cd ios/App
xcodebuild clean
rm -rf ~/Library/Developer/Xcode/DerivedData/*
cd ../..
# Retry build
```

**"App rejected - Policy violation"**
- Review app store review guidelines
- Ensure data privacy practices match policy
- Resubmit with explanation if borderline

## Android Issues

**"Upload failed - Version code not incremented"**
- versionCode in build.gradle must be higher than previous
- Increment and rebuild

**"Build failed - Gradle out of memory"**
```bash
# In android/gradle.properties add or increase:
org.gradle.jvmargs=-Xmx4096m
```

**"App rejected - Policy violation"**
- Address Google Play policy
- Resubmit via Google Play Console

---

# RESOURCES

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policies](https://play.google.com/about/developer-content-policy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Capacitor Deployment Guide](https://capacitorjs.com/docs/guides/deploying-to-app-stores)

---

**Estimated Time:**
- First release: 4-6 hours
- Subsequent updates: 1-2 hours
