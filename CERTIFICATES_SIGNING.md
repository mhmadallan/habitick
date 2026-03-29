# Certificates & Code Signing Guide

This guide covers obtaining and configuring certificates for publishing on iOS App Store and Google Play.

## Overview

**iOS** requires code signing certificates and provisioning profiles.  
**Android** requires a keystore file and signing key.

Both are required before submission to app stores.

---

## iOS Code Signing

### Prerequisites

- Apple Developer Account ($99/year) - [enroll.apple.com](https://enroll.apple.com)
- Mac with Xcode 14+
- Your app's Bundle ID: `com.habitick.app` (from capacitor.config.ts)

### Step 1: Create Apple Developer Account

1. Go to [developer.apple.com](https://developer.apple.com)
2. Click "Account" > "Sign in"
3. If no account, click "Create Apple ID"
4. Complete identity verification and payments (may take 24-48 hours)
5. Accept the Developer Program Agreement

### Step 2: Register App ID in Apple Developer Portal

1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Click "Certificates, Identifiers & Profiles"
3. Select "Identifiers" from the left menu
4. Click the "+" button to add new identifier
5. Select "App IDs"
6. Enter:
   - **Bundle ID:** `com.habitick.app`
   - **Description:** "Habitick Mobile App"
   - **Capabilities:** 
     - Push Notifications (if planning to add later)
     - Sign in with Apple (optional)
7. Click "Continue" > "Register"

### Step 3: Create Development Certificate

1. In Apple Developer Portal, go to "Certificates"
2. Click "+" to add new certificate
3. Select "Apple Development" (or "iOS App Development")
4. Click "Continue"
5. Select "Choose File" and upload a Certificate Signing Request (CSR):
   - **Option A:** Xcode generates it for you (recommended)
   - **Option B:** Use Keychain Access
6. Click "Continue"
7. Download the `.cer` file
8. Double-click to install in Keychain

### Step 4: Create Provisioning Profile

1. In Apple Developer Portal, go to "Profiles"
2. Click "+" to create new profile
3. Select "iOS App Development"
4. Select your App ID: `com.habitick.app`
5. Select your Development Certificate
6. Name it: "Habitick Development"
7. Download the `.mobileprovision` file
8. Double-click to install

### Step 5: Automatic Signing in Xcode (Easiest)

This is the simplest approach - Xcode manages certificates automatically:

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select the "App" project in the left navigator
3. Select the "App" target
4. Go to "Signing & Capabilities" tab
5. Under "Signing," select your team in "Team" dropdown
6. Xcode will automatically create/manage certificates

**That's it!** Xcode handles the rest.

### Step 6: Create Distribution Certificate (For App Store)

When ready to submit to App Store:

1. In Apple Developer Portal, go to "Certificates"
2. Click "+" to add certificate
3. Select "Apple Distribution"
4. Upload CSR (Xcode will prompt you)
5. Download and install the `.cer` file
6. In Xcode, make sure your Distribution certificate is selected in "Signing & Capabilities"

### Step 7: Create App Store Provisioning Profile

1. In Apple Developer Portal, go to "Profiles"
2. Click "+" for new profile
3. Select "App Store Connect"
4. Select your App ID
5. Select your Distribution Certificate
6. Name it: "Habitick App Store"
7. Download and install

### Step 8: Set Up in Xcode

1. Open `ios/App/App.xcworkspace`
2. Select "App" project > "App" target
3. Go to "Build Settings"
4. Search "Code Sign Identity"
5. Ensure "iPhone Distribution" is selected for Release builds
6. Ensure correct provisioning profile is selected

---

## Android Code Signing

### Step 1: Generate Keystore File

A keystore contains your signing key. Generate it with:

```bash
keytool -genkey -v -keystore habitick-release.keystore -keyalg RSA -keysize 2048 -validity 10000

# Or on Windows:
"%JAVA_HOME%\bin\keytool.exe" -genkey -v -keystore habitick-release.keystore -keyalg RSA -keysize 2048 -validity 10000
```

**When prompted, enter:**
```
Keystore password: [Create a strong password]
Key password: [Same as keystore password]
First and last name: [Your name or company]
Organizational unit: [e.g., Apps]
Organization: [Your company name]
City or Locality: [Your city]
State or Province: [Your state]
Country code: [US, etc.]
```

**Output:** `habitick-release.keystore` file (keep this safe!)

**Save this file in your project:**
```bash
mkdir android/keystore
mv habitick-release.keystore android/keystore/
```

### Step 2: Configure Gradle to Sign Releases

Edit `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    
    defaultConfig {
        // ... existing config
    }
    
    signingConfigs {
        release {
            keyAlias 'habitick'
            keyPassword 'YOUR_KEY_PASSWORD'
            storeFile file('keystore/habitick-release.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}
```

**⚠️ SECURITY:** Never commit passwords to Git!

**Better approach (using environment variables):**

```gradle
signingConfigs {
    release {
        keyAlias System.getenv("RELEASE_KEY_ALIAS") ?: 'habitick'
        keyPassword System.getenv("RELEASE_KEY_PASSWORD")
        storeFile file('keystore/habitick-release.keystore')
        storePassword System.getenv("RELEASE_STORE_PASSWORD")
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

Set environment variables before building:
```bash
export RELEASE_KEY_ALIAS=habitick
export RELEASE_KEY_PASSWORD=your_key_password
export RELEASE_STORE_PASSWORD=your_keystore_password
```

Or in `local.properties` (don't commit):
```properties
RELEASE_KEY_ALIAS=habitick
RELEASE_KEY_PASSWORD=your_key_password
RELEASE_STORE_PASSWORD=your_keystore_password
```

### Step 3: Build Signed APK/AAB

**Build Release APK:**
```bash
cd android
./gradlew assembleRelease
cd ..
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

**Build Release AAB (App Bundle - Required for Google Play):**
```bash
cd android
./gradlew bundleRelease
cd ..
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

**Use AAB for Google Play submission!**

### Step 4: Verify Signature

Check that your APK is properly signed:

```bash
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk
```

Should show: `jar verified`

---

## Key Management & Security

### iOS

- **Store Certificates:** In Keychain (automatic)
- **Export for Team:** Export `.p12` file from Keychain for sharing (if needed)
- **Revoke if Compromised:** In Apple Developer Portal, revoke immediately
- **Keep Backups:** Export certificates regularly and store securely

### Android

- **Keystore Storage:**
  - Store `habitick-release.keystore` securely (NOT in Git)
  - Back up to encrypted storage
  - Use same keystore for all app updates (required by Google Play)

- **Password Management:**
  - Use unique, strong passwords (20+ characters)
  - Store passwords in secure manager (1Password, LastPass, etc.)
  - Never commit to version control
  - Share only with trusted team members if needed

- **If Keystore is Lost:**
  - You **cannot** update your existing app
  - You **must** create a new app with different Bundle ID
  - Use version control to prevent accidents

### CRITICAL: Keystore Backup Strategy

```bash
# Back up your keystore securely
# Option 1: Encrypted drive/USB
gpg --encrypt habitick-release.keystore

# Option 2: Password manager
# Store base64 encoded keystore with password separately

# Never do this:
# - Don't commit keystore to Git (even private repos)
# - Don't email unencrypted
# - Don't share publicly
```

---

## Troubleshooting

### iOS

**Error: "No matching signing identities found"**
- Fix: Check that your development certificate is installed
- Xcode > Settings > Accounts > Download Manual Profiles

**Error: "Provisioning profile 'X' is invalid"**
- Fix: Regenerate provisioning profile in Apple Developer Portal
- Download and install the new `.mobileprovision` file

**Error: "Failed to locate valid provisioning profile"**
- Fix: In Xcode, go to Product > Clean Build Folder
- Then Product > Build

### Android

**Error: "Keystore was tampered with"**
- Fix: Check that keystore file wasn't corrupted
- Verify using: `keytool -list -v -keystore habitick-release.keystore`

**Error: "Keystore password was incorrect"**
- Fix: Verify password in build.gradle or environment variables
- If forgotten, you must create new keystore (see note above)

**Error: "Key was not found in keystore"**
- Fix: Verify key alias matches in build.gradle
- List keys: `keytool -list -keystore habitick-release.keystore`

---

## Summary Checklist

### iOS

- [ ] iOS Developer Account created ($99/year)
- [ ] Developer Agreement accepted
- [ ] App ID registered (`com.habitick.app`)
- [ ] Development Certificate created
- [ ] Development Provisioning Profile created
- [ ] Xcode team selected (automatic signing enabled)
- [ ] Distribution Certificate created
- [ ] App Store Provisioning Profile created
- [ ] Build Settings configured for app store signing

### Android

- [ ] Keystore file generated (`habitick-release.keystore`)
- [ ] Keystore backed up securely
- [ ] Passwords stored in secure manager
- [ ] `build.gradle` configured with signing config
- [ ] Environment variables or local.properties set up
- [ ] Release APK builds successfully
- [ ] Release AAB builds successfully
- [ ] Signature verified

---

## Next Steps

1. **Complete iOS setup** and test on device
2. **Complete Android setup** and build release APK
3. **Test both builds** thoroughly
4. **Proceed to App Store submissions** (see APPSTORE_SUBMISSION.md)

## Resources

- [Apple Development Docs](https://developer.apple.com/documentation/)
- [iOS Code Signing Guide](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingSigningIdentities/MaintainingSigningIdentities.html)
- [Android Signing Docs](https://developer.android.com/studio/publish/app-signing)
- [Capacitor iOS Deployment](https://capacitorjs.com/docs/guides/deploying-to-app-stores#ios)
- [Capacitor Android Deployment](https://capacitorjs.com/docs/guides/deploying-to-app-stores#android)
