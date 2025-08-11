# Optimized build script for React Native Android app on Windows
Write-Host "Building React Native Android app with optimizations..." -ForegroundColor Green

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:ANDROID_HOME = "C:\Users\AnasHK\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:PATH"

# Set gradle options to prevent hanging
$env:GRADLE_OPTS = "-Dorg.gradle.daemon=false -Dorg.gradle.parallel=false -Dorg.gradle.workers.max=1 -Xmx4096m"

# Navigate to android directory
Set-Location android

# Stop any existing gradle daemons
Write-Host "Stopping Gradle daemons..." -ForegroundColor Yellow
& .\gradlew --stop

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "app\build") {
    Remove-Item -Path "app\build" -Recurse -Force -ErrorAction SilentlyContinue
}

# Build the app with specific settings to prevent hanging
Write-Host "Building APK (this may take a few minutes)..." -ForegroundColor Yellow
& .\gradlew assembleDebug `
    --no-daemon `
    --no-parallel `
    --no-build-cache `
    --max-workers=1 `
    --console=plain `
    -x lint `
    -x lintDebug `
    -PreactNativeArchitectures=arm64-v8a

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        Write-Host "APK location: $((Get-Location).Path)\$apkPath" -ForegroundColor Cyan
        Write-Host "APK size: $([math]::Round((Get-Item $apkPath).Length / 1MB, 2)) MB" -ForegroundColor Cyan
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}

Set-Location ..
