@echo off
echo Configurando GitHub Secrets para Firebase...
echo.

REM Verificar si gh CLI está instalado
gh --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ GitHub CLI no está instalado.
    echo.
    echo Instálalo desde: https://cli.github.com/
    echo O configura los secrets manualmente en: https://github.com/dmenta/prompt-dict/settings/secrets/actions
    pause
    exit /b 1
)

echo ✅ GitHub CLI encontrado. Configurando secrets...
echo.

REM Leer variables del archivo .env.local
for /f "usebackq tokens=1,2 delims==" %%A in (".env.local") do (
    if "%%A"=="FIREBASE_API_KEY" set "FIREBASE_API_KEY=%%B"
    if "%%A"=="FIREBASE_AUTH_DOMAIN" set "FIREBASE_AUTH_DOMAIN=%%B"
    if "%%A"=="FIREBASE_PROJECT_ID" set "FIREBASE_PROJECT_ID=%%B"
    if "%%A"=="FIREBASE_STORAGE_BUCKET" set "FIREBASE_STORAGE_BUCKET=%%B"
    if "%%A"=="FIREBASE_MESSAGING_SENDER_ID" set "FIREBASE_MESSAGING_SENDER_ID=%%B"
    if "%%A"=="FIREBASE_APP_ID" set "FIREBASE_APP_ID=%%B"
    if "%%A"=="FIREBASE_MEASUREMENT_ID" set "FIREBASE_MEASUREMENT_ID=%%B"
)

REM Configurar cada secret
echo Configurando FIREBASE_API_KEY...
gh secret set FIREBASE_API_KEY --body "%FIREBASE_API_KEY%"

echo Configurando FIREBASE_AUTH_DOMAIN...
gh secret set FIREBASE_AUTH_DOMAIN --body "%FIREBASE_AUTH_DOMAIN%"

echo Configurando FIREBASE_PROJECT_ID...
gh secret set FIREBASE_PROJECT_ID --body "%FIREBASE_PROJECT_ID%"

echo Configurando FIREBASE_STORAGE_BUCKET...
gh secret set FIREBASE_STORAGE_BUCKET --body "%FIREBASE_STORAGE_BUCKET%"

echo Configurando FIREBASE_MESSAGING_SENDER_ID...
gh secret set FIREBASE_MESSAGING_SENDER_ID --body "%FIREBASE_MESSAGING_SENDER_ID%"

echo Configurando FIREBASE_APP_ID...
gh secret set FIREBASE_APP_ID --body "%FIREBASE_APP_ID%"

echo Configurando FIREBASE_MEASUREMENT_ID...
gh secret set FIREBASE_MEASUREMENT_ID --body "%FIREBASE_MEASUREMENT_ID%"

echo.
echo ✅ Todos los secrets configurados correctamente!
echo.
echo Ahora puedes hacer push para probar el deploy automático.
pause
