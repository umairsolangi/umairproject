# PowerShell script to fix react-native-gesture-handler imports
# This script will replace gesture-handler imports with react-native imports

$projectPath = "C:\Projects\UmairProject\Last_Mile_Delivery"
$componentsPath = Join-Path $projectPath "Components"

Write-Host "Fixing react-native-gesture-handler imports..." -ForegroundColor Green

# Find all JavaScript files
$jsFiles = Get-ChildItem -Path $componentsPath -Filter "*.js" -Recurse

foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Check if file contains gesture-handler imports
    if ($content -match "from 'react-native-gesture-handler'") {
        Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
        
        # Replace common gesture-handler imports with react-native imports
        # Pattern 1: import {RefreshControl, ScrollView} from 'react-native-gesture-handler'
        $content = $content -replace "import\s+\{([^}]*(?:RefreshControl|ScrollView)[^}]*)\}\s+from\s+'react-native-gesture-handler';?", "import {`$1} from 'react-native';"
        
        # Pattern 2: Just ScrollView
        $content = $content -replace "import\s+\{ScrollView\}\s+from\s+'react-native-gesture-handler';?", "import {ScrollView} from 'react-native';"
        
        # Pattern 3: Just RefreshControl  
        $content = $content -replace "import\s+\{RefreshControl\}\s+from\s+'react-native-gesture-handler';?", "import {RefreshControl} from 'react-native';"
        
        # Pattern 4: For any other gesture-handler specific components, comment them out
        if ($content -match "from 'react-native-gesture-handler'") {
            # If there are still gesture-handler imports, comment them out
            $content = $content -replace "(import.*from\s+'react-native-gesture-handler';?)", "// `$1 // Disabled due to compatibility issues"
        }
        
        # Save the modified content if changes were made
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`nImport fixes completed!" -ForegroundColor Green
Write-Host "Note: Some components may still need manual adjustment if they use gesture-specific features." -ForegroundColor Yellow
