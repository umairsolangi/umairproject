@echo off
echo Killing all Java processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul

echo Setting environment...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot
set ANDROID_HOME=C:\Users\AnasHK\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%
set GRADLE_OPTS=-Xmx2048m -Dorg.gradle.daemon=false -Dorg.gradle.parallel=false -Dorg.gradle.workers.max=1 -Dorg.gradle.configureondemand=false

echo Cleaning cache...
rd /s /q .gradle 2>nul
rd /s /q app\build 2>nul

echo Building APK (this will take time, please be patient)...
call gradlew.bat assembleDebug --no-daemon --no-parallel --no-build-cache --max-workers=1 -Dorg.gradle.jvmargs="-Xmx2048m" --warning-mode=none

if %errorlevel% == 0 (
    echo.
    echo BUILD SUCCESSFUL!
    echo APK Location: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo.
    echo BUILD FAILED!
)

pause
