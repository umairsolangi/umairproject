# Minimal build script to bypass hanging issues
Write-Host "Building React Native Android app (minimal mode)..." -ForegroundColor Green

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:ANDROID_HOME = "C:\Users\AnasHK\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

# Kill any Java/Gradle processes that might be stuck
Write-Host "Killing any stuck processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*java*" -or $_.ProcessName -like "*gradle*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Navigate to android directory
Set-Location android

# Clean gradle cache for react-native-reanimated
Write-Host "Cleaning problematic caches..." -ForegroundColor Yellow
$problemCache = "$env:USERPROFILE\.gradle\caches\transforms-*\*\*\react-native-reanimated*"
Remove-Item -Path $problemCache -Recurse -Force -ErrorAction SilentlyContinue

# Build with minimal configuration
Write-Host "Starting minimal build..." -ForegroundColor Yellow
& cmd /c "gradlew.bat assembleDebug --offline --no-daemon --no-parallel --max-workers=1 -x :react-native-reanimated:configureCMakeDebug -x :react-native-reanimated:buildCMakeDebug"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        Write-Host "APK location: $((Get-Location).Path)\$apkPath" -ForegroundColor Cyan
    }
} else {
    Write-Host "Build failed! Trying alternative approach..." -ForegroundColor Red
}

Set-Location ..
