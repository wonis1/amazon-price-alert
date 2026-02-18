import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const icons = {
  google:
    'https://img.icons8.com/color/48/google-logo.png',
  apple:
    'https://img.icons8.com/ios-filled/20/ffffff/mac-os.png',
};

type Props = { navigation: any };

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const onLogin = () => navigation.replace('Home');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://img.icons8.com/color/96/price-tag-usd.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.title}>프라이스 트래커</Text>
          <Text style={styles.subtitle}>
            아마존 상품 가격을 추적하고{'\n'}최적의 구매 시점을 알려드립니다
          </Text>

          <TouchableOpacity style={styles.googleBtn} onPress={onLogin}>
            <View style={styles.btnContent}>
              <Image source={{ uri: icons.google }} style={styles.btnIcon} />
              <Text style={styles.googleText}>Google로 시작하기</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appleBtn} onPress={onLogin}>
            <View style={styles.btnContent}>
              <Image source={{ uri: icons.apple }} style={styles.btnIcon} />
              <Text style={styles.appleText}>Apple로 시작하기</Text>
            </View>
          </TouchableOpacity>


          <Text style={styles.footer}>
            로그인하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주됩니다
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#e8eefc' },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'linear-gradient(180deg, #e8eefc 0%, #dfe8ff 100%)', // RN에는 직접 그라데이션이 없어 단색 배경 느낌; 필요하면 expo-linear-gradient 사용
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  icon: { width: 72, height: 72, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  subtitle: {
    textAlign: 'center',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 24,
  },
  googleBtn: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  googleText: { fontWeight: '600', color: '#111827' },
  appleBtn: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#000',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  appleText: { fontWeight: '700', color: '#fff' },
  footer: { color: '#94a3b8', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // RN 최신이면 사용, 아니면 아래 marginRight 사용
  },
  btnIcon: { width: 20, height: 20, marginRight: 8 }

});

export default LoginScreen;
