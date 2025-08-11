# Build script for React Native Android app
Write-Host "Building React Native Android app..." -ForegroundColor Green

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:ANDROID_HOME = "C:\Users\AnasHK\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:PATH"

# Kill any existing gradle daemons
Write-Host "Stopping Gradle daemons..." -ForegroundColor Yellow
Set-Location android
& .\gradlew --stop

# Clean build cache
Write-Host "Cleaning build cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\build-cache-*" -Recurse -Force -ErrorAction SilentlyContinue

# Build the app
Write-Host "Building APK..." -ForegroundColor Yellow
& .\gradlew assembleDebug --no-daemon --no-build-cache --max-workers=2 --console=plain

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        Write-Host "APK location: $((Get-Location).Path)\$apkPath" -ForegroundColor Cyan
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}

Set-Location ..
