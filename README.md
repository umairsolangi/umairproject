<h1 align="center">🚚 Last Mile Delivery System</h1>

<p align="center">
  <b>React Native Multi-Role Delivery App</b><br/>
  Connecting Customers, Vendors & Riders for Seamless Ordering, Delivery & Parcel Services
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Mobile App-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Laravel-ff2d20?style=flat-square&logo=laravel" />
  <img src="https://img.shields.io/badge/API-RESTful-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
</p>

---

## 🧭 Overview

**Last Mile Delivery System** is a comprehensive delivery platform designed for multiple roles:
- 📦 Customers: food, grocery & parcel delivery
- 🛒 Vendors: manage orders via app or API
- 🛵 Riders: track and fulfill deliveries with maps

Built with **React Native CLI** on the frontend and **Laravel** backend, it supports real-time order tracking, vendor onboarding, courier features, and branch/shop management.

---

## 📱 Key Features

### 👤 For Customers
- 🛍 Place orders from multiple vendors
- 📦 Track order status in real-time
- 📅 Schedule orders & deliveries
- 🍽 Create daily food menus
- 📮 Send/receive parcels via courier system

### 🧑‍🍳 For Vendors
- 🏪 Create shops & multi-branch setups
- 🔁 Manage new orders and sub-orders
- ✔️ Admin-based approval system
- ⚙️ **API Vendors**: Integrate with platform using REST APIs

### 🧍 For Riders
- 🚚 Accept delivery/courier jobs
- 💰 View earnings and delivery logs
- 🗺️ Use map for directions and distance tracking

---

## 🛠 Tech Stack

| Layer       | Technologies Used                                         |
|-------------|------------------------------------------------------------|
| **Mobile**  | React Native CLI, React Native Paper, Maps, Step Indicator |
| **State**   | Context API (global state management)                      |
| **Backend** | Laravel (PHP), RESTful APIs                                |
| **Database**| MySQL                                                      |
| **Others**  | Haversine formula, Location APIs, Role-based routing       |

---

## 🧑‍💻 Folder Structure

```
Last_Mile_Delivery/
├── Components/           # React Native components
├── Context/             # Global state management
├── android/             # Android build files
├── App.js              # Main app entry point
├── package.json        # Dependencies
└── README.md           # This file
```

---

# 🚀 Complete Setup & Run Guide

## Prerequisites Verification

### 1. Java Development Kit (JDK 17)
```powershell
# Check Java version (MUST show 17.x.x)
java -version

# If not JDK 17, download from: https://www.oracle.com/java/technologies/downloads/#java17
```

### 2. Node.js and npm
```powershell
# Check versions (Node 16+ required)
node --version
npm --version
```

### 3. Android SDK Setup
```powershell
# Verify environment variables
echo $env:ANDROID_HOME     # Should show: C:\Users\[Username]\AppData\Local\Android\Sdk
echo $env:PATH            # Should include platform-tools
```

**If ANDROID_HOME not set:**
```powershell
# Set ANDROID_HOME (replace [Username] with your actual username)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\[Username]\AppData\Local\Android\Sdk", "User")

# Add platform-tools to PATH
$androidHome = [System.Environment]::GetEnvironmentVariable("ANDROID_HOME", "User")
$platformTools = "$androidHome\platform-tools"
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
[System.Environment]::SetEnvironmentVariable("PATH", "$currentPath;$platformTools", "User")

# Restart PowerShell after setting variables
```

## Device Setup

### 1. Enable Developer Mode on Android Device
1. Go to **Settings > About Phone**
2. Tap **"Build Number"** 7 times
3. Go back to **Settings > Developer Options**
4. Enable **"USB Debugging"**
5. Enable **"Install via USB"**

### 2. Connect Device & Verify
```powershell
# Check device connection
adb devices

# Should output:
# List of devices attached
# XXXXXXXXX       device

# If shows "unauthorized", check phone for permission prompt
```

## 🎯 Running the App

### Method 1: Quick Start (2 Terminals)

**Terminal 1 - Start Metro Bundler:**
```powershell
cd C:\Projects\UmairProject\Last_Mile_Delivery
npx react-native start --reset-cache
```
**Keep this terminal open!**

**Terminal 2 - Run App:**
```powershell
cd C:\Projects\UmairProject\Last_Mile_Delivery
npx react-native run-android
```

### Method 2: Using Optimized Script (Recommended for Build Issues)
```powershell
# If build hangs or has memory issues
.\run-app-optimized.ps1
```

### Method 3: Manual APK Install (If APK Already Exists)
```powershell
# Install pre-built APK
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Start the app
adb shell am start -n com.reactproject/.MainActivity
```

## 🔧 Troubleshooting

### Issue 1: Port 8081 Already in Use
```powershell
# Kill existing Metro process
taskkill /F /IM node.exe

# Or find specific PID
netstat -ano | findstr :8081
taskkill /F /PID [PID_NUMBER]
```

### Issue 2: Gradle Build Hanging
```powershell
# Clean build with minimal resources
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug --no-daemon --max-workers=1 --no-parallel --no-build-cache --console=plain
cd ..
```

### Issue 3: Device Not Recognized
```powershell
# Restart ADB
adb kill-server
adb start-server
adb devices

# Try different USB cable/port if still not showing
```

### Issue 4: Java Version Error
```powershell
# Verify JDK 17 is active
java -version

# Set JAVA_HOME if needed
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")

# Ensure gradle.properties has: org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
```

### Issue 5: App Crashes on Launch
```powershell
# View device logs
npx react-native log-android

# Clear app data
adb shell pm clear com.reactproject

# Reinstall app
npx react-native run-android
```

### Issue 6: Clean Everything & Start Fresh
```powershell
# Nuclear option - clean everything
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
cd android && .\gradlew.bat clean && cd ..
npx react-native run-android
```

## 📋 One-Line Quick Commands

```powershell
# Check everything is ready
java -version; node --version; adb devices

# Fresh install & run
cd C:\Projects\UmairProject\Last_Mile_Delivery; adb devices; npx react-native run-android

# Just install APK (if built)
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Start app on device
adb shell am start -n com.reactproject/.MainActivity

# View logs
npx react-native log-android
```

## 📱 Development Workflow

### Hot Reload
- Save any JS file → App automatically reloads
- Press `R` twice in Metro terminal to reload manually

### Debug Menu
- Shake device OR run: `adb shell input keyevent 82`
- Select "Debug with Chrome" for DevTools

### Production Build
```powershell
cd android
.\gradlew.bat assembleRelease
# APK location: android\app\build\outputs\apk\release\app-release.apk
```

## ✅ Success Checklist

1. ✅ **Java 17 installed** (`java -version`)
2. ✅ **Node.js 16+** (`node --version`)
3. ✅ **Android SDK configured** (`echo $env:ANDROID_HOME`)
4. ✅ **Device connected** (`adb devices`)
5. ✅ **USB Debugging enabled** on device
6. ✅ **Metro bundler running** (Terminal 1)
7. ✅ **App successfully installed** on device

## 🆘 Still Having Issues?

1. **Restart everything**: Close all terminals, disconnect/reconnect device
2. **Try different USB cable/port**
3. **Disable antivirus** temporarily during build
4. **Ensure 8GB+ RAM available** for Gradle builds
5. **Use the optimized script**: `.\run-app-optimized.ps1`
📌 Project Goals
✅ Deliver a scalable & modular multi-role delivery app

✅ Integrate real-time geolocation and delivery tracking

✅ Enable in-app + API vendor systems

✅ Support parcel, food, grocery, and pharmacy use cases

🙋‍♂️ Author
Muhammad Rehman
Frontend Developer (React.js & React Native)
📧 rehmanattock30@gmail.com
🔗 Portfolio
🔗 LinkedIn

⭐ Support & Feedback
If you found this project useful, consider giving it a ⭐
Feel free to open issues or fork the repo for your own custom delivery platform!

<p align="center"> Thanks for visiting! 🚀<br/> Built with 💙 using React Native & Laravel </p> 



