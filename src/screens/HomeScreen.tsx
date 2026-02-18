import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
// import { useEffect, useState as useStateHook } from 'react'; // TODO: enable when wiring session/token handling
// import { supabase } from '../lib/supabaseClient'; // TODO: enable after backend connection
// import * as Notifications from 'expo-notifications'; // TODO: enable for push permission

type Props = {
  navigation: any;
};

const products = [
  {
    id: '1',
    title: 'Apple AirPods Pro (2nd Generation)',
    price: '$199.99',
    originalPrice: '$249.99',
    change: '-20.0%',
    changeColor: '#1fa76f',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    alertSet: true,
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: '$329.99',
    originalPrice: '$399.99',
    change: '-17.5%',
    changeColor: '#1fa76f',
    image:
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=400&q=80',
    alertSet: false,
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowMenu(true)}>
          <Text style={styles.iconButtonText}>☰</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>(
    'unknown'
  );

  const onRegisterProduct = () => {
    // TODO: Call Keepa API with productUrl, then refresh product list
    setShowAddModal(false);
    setProductUrl('');
  };

  const requestNotificationPermission = async () => {
    // TODO: enable Notifications.requestPermissionsAsync() and handle token
    // const { status } = await Notifications.requestPermissionsAsync();
    // setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    setPermissionStatus('granted'); // mock
    setShowMenu(false);
  };

  const onLogout = async () => {
    // TODO: await supabase.auth.signOut();
    // navigation.replace('Login');
    setShowMenu(false);
  };

  const trackedCount = products.length;
  const alertsOn = products.filter(p => p.alertSet).length;

  // TODO: enable when backend is connected
  // const [session, setSession] = useStateHook(null); // holds current session
  // const [accessToken, setAccessToken] = useStateHook<string | null>(null); // stores access token
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data }) => {
  //     setSession(data.session ?? null);
  //     setAccessToken(data.session?.access_token ?? null);
  //   });
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     (_event, newSession) => {
  //       setSession(newSession);
  //       setAccessToken(newSession?.access_token ?? null);
  //     }
  //   );
  //   return () => {
  //     authListener?.subscription.unsubscribe();
  //   };
  // }, []);

  const onAddProduct = () => {
    setShowAddModal(true);
  };

  const permissionLabel =
    permissionStatus === 'granted'
      ? '푸시 권한: 허용'
      : permissionStatus === 'denied'
      ? '푸시 권한: 거부'
      : '푸시 권한: 미확인';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>가격 추적</Text>
          <Text style={styles.headerSubtitle}>
            {trackedCount}개 상품을 추적 중 · 알림 설정 {alertsOn}개
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addButton} onPress={onAddProduct}>
            <Text style={styles.addButtonText}>+ 상품 등록</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>세션 상태</Text>
        <Text style={styles.sessionText}>
          로그인 후 받은 세션/토큰을 저장하고 유지합니다. (백엔드 연동 시 주석 해제)
        </Text>
        <Text style={styles.sessionSubText}>현재 세션: 예시 상태 · 토큰: 예시</Text>
        <View style={styles.permissionRow}>
          <Text style={styles.permissionLabel}>{permissionLabel}</Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestNotificationPermission}>
            <Text style={styles.permissionBtnText}>알림 권한 요청</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {products.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.originalPrice}>{item.originalPrice}</Text>
              </View>
              <View style={styles.footerRow}>
                <View style={[styles.badge, { backgroundColor: '#e8f8f1' }]}>
                  <Text style={[styles.badgeText, { color: item.changeColor }]}>
                    ↓{item.change}
                  </Text>
                </View>
                {item.alertSet && (
                  <Text style={styles.alertText}>가격 알림 설정됨</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>상품 등록</Text>
                </View>
                <Text style={styles.modalLabel}>아마존 상품 링크</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="https://www.amazon.com/..."
                  placeholderTextColor="#9ca3af"
                  value={productUrl}
                  onChangeText={setProductUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.modalHint}>추적하고 싶은 아마존 상품의 URL을 입력해주세요</Text>
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity style={styles.modalCancel} onPress={() => setShowAddModal(false)}>
                    <Text style={styles.modalCancelText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSubmit} onPress={onRegisterProduct}>
                    <Text style={styles.modalSubmitText}>등록하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuCard}>
                <Text style={styles.menuTitle}>메뉴</Text>
                {/* <TouchableOpacity style={styles.menuItem} onPress={requestNotificationPermission}>
                  <Text style={styles.menuItemText}>알림 권한 요청</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                  <Text style={styles.menuItemText}>로그아웃</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuClose} onPress={() => setShowMenu(false)}>
                  <Text style={styles.menuCloseText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc', padding: 16 },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#121212' },
  headerSubtitle: { marginTop: 4, color: '#6b7280' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 33,
    height: 33,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: { fontSize: 24, color: '#111827', fontWeight: '500' },
  addButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sessionCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  sessionTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  sessionText: { fontSize: 13, color: '#4b5563', lineHeight: 18 },
  sessionSubText: { fontSize: 12, color: '#6b7280' },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  permissionLabel: { color: '#0f172a', fontWeight: '700' },
  permissionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a73e8',
    borderRadius: 10,
  },
  permissionBtnText: { color: '#fff', fontWeight: '700' },
  list: { paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 16, fontWeight: '700', color: '#111827' },
  originalPrice: {
    fontSize: 13,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  badgeText: { fontWeight: '700', fontSize: 13 },
  alertText: { fontSize: 13, color: '#0f172a', fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  modalClose: { fontSize: 18, color: '#6b7280' },
  modalLabel: { marginTop: 16, marginBottom: 6, color: '#374151', fontWeight: '600' },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#111827',
    fontWeight: '600',
  },
  modalHint: { marginTop: 8, color: '#6b7280', fontSize: 12 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, gap: 10 },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalCancelText: { color: '#374151', fontWeight: '700' },
  modalSubmit: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
  },
  modalSubmitText: { color: '#fff', fontWeight: '800' },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 10,
  },
  menuTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemText: { fontSize: 15, color: '#111827', fontWeight: '600' },
  menuClose: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  menuCloseText: { color: '#6b7280', fontWeight: '700' },
});

export default HomeScreen;













