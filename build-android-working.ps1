# Working build script for React Native Android
Write-Host "Building React Native Android app..." -ForegroundColor Green

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:ANDROID_HOME = "C:\Users\AnasHK\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

# Kill any stuck processes
Write-Host "Cleaning up processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*java*" -or $_.ProcessName -like "*gradle*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Navigate to android directory
Set-Location android

# Stop gradle daemon
Write-Host "Stopping Gradle daemon..." -ForegroundColor Yellow
& .\gradlew --stop

# Build with optimized settings to avoid hanging
Write-Host "Building APK (this may take several minutes)..." -ForegroundColor Yellow
& cmd /c "gradlew.bat assembleDebug --no-daemon --max-workers=1 --console=plain -x :react-native-reanimated:configureCMakeDebug -x :react-native-reanimated:buildCMakeDebug -x :react-native-reanimated:configureCMakeRelWithDebInfo -x :react-native-reanimated:buildCMakeRelWithDebInfo"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBuild successful!" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
        Write-Host "APK created successfully!" -ForegroundColor Green
        Write-Host "Location: $((Get-Location).Path)\$apkPath" -ForegroundColor Cyan
        Write-Host "Size: $apkSize MB" -ForegroundColor Cyan
        
        # Offer to install on connected device
        $devices = & adb devices | Select-String -Pattern "device$"
        if ($devices) {
            Write-Host "`nDevice detected. Installing APK..." -ForegroundColor Yellow
            & adb install -r $apkPath
            Write-Host "APK installed!" -ForegroundColor Green
        } else {
            Write-Host "`nNo device connected. You can install the APK manually later." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "`nBuild failed!" -ForegroundColor Red
}

Set-Location ..
