# Mobile Environment Configuration

When running on mobile devices, you may need to update your API base URL.

## Update API Base URL for Mobile

In `public/index.html` (and other HTML files), you may see:
```html
<meta name="habitick-api-base" content="https://habitick.onrender.com" />
```

### For Local Development

If running your Express backend locally and testing on a mobile device/emulator:

**For Android Emulator:**
```html
<meta name="habitick-api-base" content="http://10.0.2.2:3000" />
```

**For iOS Simulator:**
```html
<meta name="habitick-api-base" content="http://localhost:3000" />
```

**For Physical Devices (iOS/Android):**
Replace with your machine's local IP address:
```html
<meta name="habitick-api-base" content="http://192.168.1.100:3000" />
```

To find your local IP:
- **Mac/Linux:** `ifconfig | grep "inet "` (look for 192.168.x.x)
- **Windows:** `ipconfig` (look for IPv4 Address)

## Environment-Based Configuration

Consider updating `public/index.js` or `public/config.js` to detect the environment:

```javascript
function getAPIBase() {
  // Check if running in Capacitor app
  if (window.Capacitor?.isPluginAvailable('Device')) {
    // For mobile app, detect device and set appropriate URL
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      return 'http://10.0.2.2:3000'; // Android emulator special IP
    }
  }
  
  // Default to meta tag or production URL
  return document.querySelector('meta[name="habitick-api-base"]')?.getAttribute('content') 
    || 'https://habitick.onrender.com';
}

const API_BASE = getAPIBase();
```

## CORS Configuration

Your Express server already has CORS configured via `ALLOWED_ORIGINS` environment variable.

When testing mobile apps, add your local environment to ALLOWED_ORIGINS:
```bash
export ALLOWED_ORIGINS="http://localhost:3000,http://10.0.2.2:3000,http://192.168.1.100:3000"
```

Or in `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://10.0.2.2:3000,http://192.168.1.100:3000
```
