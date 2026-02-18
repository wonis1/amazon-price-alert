# AmazonPriceAlert

React Native CLI 기반 Android 앱입니다.

## 1. 실행 전 준비

```bash
npm install
```

Android 개발 환경이 준비되어 있어야 합니다.
- Android Studio
- Android SDK / platform-tools (`adb`)
- USB 디버깅 가능한 실제 기기 또는 에뮬레이터

## 2. 빠른 검증(권장)

푸시 전에 최소 아래 2개를 먼저 확인합니다.

```bash
npm test -- --runInBand
npx tsc --noEmit
```

## 3. 앱 실행

Metro가 이미 떠 있다면 그대로 진행해도 됩니다.

```bash
npm run android
```

## 4. 실제 스마트폰으로 실행

QR 방식(Expo Go)은 이 프로젝트에서 동작하지 않습니다.  
이 프로젝트는 네이티브 APK 설치 방식입니다.

1. 스마트폰에서 `개발자 옵션` + `USB 디버깅` 활성화
2. USB 케이블 연결 후 디버깅 허용 팝업 승인
3. 연결 확인

```bash
adb devices
```

정상 상태 예시:

```text
R3CWC0HHJ2K    device
```

4. 앱 실행

```bash
npm run android
```

특정 기기에 강제로 설치하려면:

```bash
npx react-native run-android --deviceId <DEVICE_ID>
```

## 5. 에뮬레이터 실행(Android Studio)

1. `Tools > Device Manager`
2. `Create device`
3. System Image 다운로드 후 AVD 생성
4. `▶`로 에뮬레이터 부팅
5. `npm run android` 실행

## 6. 자주 발생한 오류와 해결

### A. `device '... not found'`

빌드는 됐지만 설치 순간 연결이 끊긴 경우입니다.

```bash
adb kill-server
adb start-server
adb devices
npm run android
```

`adb devices` 상태가 `device`인지 확인합니다.  
`unauthorized`/`offline`이면 폰에서 디버깅 허용을 다시 승인합니다.

### B. `react-native-get-random-values ... projectDirectory does not exist`

프로젝트 경로 변경 후 Gradle autolinking 캐시가 이전 경로를 참조할 때 발생합니다.

```bash
Remove-Item -Recurse -Force .\android\build, .\android\.gradle -ErrorAction SilentlyContinue
npm run android
```

### C. Jest에서 `Unexpected token 'export'`

`@react-navigation` ESM 변환 설정 누락 문제입니다.  
현재는 `jest.config.js`, `jest.setup.js` 반영으로 해결된 상태입니다.

## 7. Supabase 설정

`src/lib/supabaseClient.ts`에 값이 비어 있으면 미설정 상태로 동작합니다.

```ts
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
```

실서비스 연동 시 실제 프로젝트 값으로 채우세요.

## 8. 커밋/푸시 전 체크리스트

```bash
npm test -- --runInBand
npx tsc --noEmit
git status
git add .
git commit -m "..."
git push origin <branch>
```

## 9. 배포용 빌드(APK / AAB)

### 9.1 서명 전 릴리스 아티팩트 생성

프로젝트 루트에서:

```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
.\gradlew bundleRelease
```

결과물 경로:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### 9.2 서명 키 생성(최초 1회)

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore upload-key.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

생성된 키 파일을 `android/app/upload-key.keystore`에 둡니다.

### 9.3 서명 설정

`android/gradle.properties`에 아래 값을 추가합니다(실제 값으로 변경):

```properties
MYAPP_UPLOAD_STORE_FILE=upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

`android/app/build.gradle`의 `signingConfigs`/`buildTypes.release`에 릴리스 서명 설정을 연결합니다.

### 9.4 Play Console 업로드용 AAB 빌드

```bash
cd android
.\gradlew bundleRelease
```

생성된 `app-release.aab`를 Google Play Console에 업로드하면 됩니다.
