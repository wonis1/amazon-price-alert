import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Linking,
} from 'react-native';

type Range = 'day' | 'week' | 'month';
type PriceHistoryItem = { date: string; price: number };
type ProductDetail = {
  id: string;
  title: string;
  image: string;
  storeLink: string;
  price: number;
  originalPrice: number;
  change: string;
  targetPrice?: number | null;
  alertEnabled?: boolean | null;
};

const mockHistory: Record<Range, PriceHistoryItem[]> = {
  day: [
    { date: '11월 8일', price: 219.99 },
    { date: '11월 12일', price: 214.99 },
    { date: '11월 15일', price: 205.99 },
    { date: '11월 18일', price: 199.99 },
  ],
  week: [
    { date: '10월 3주', price: 229.99 },
    { date: '10월 4주', price: 224.99 },
    { date: '11월 1주', price: 214.99 },
    { date: '11월 2주', price: 199.99 },
  ],
  month: [
    { date: '8월', price: 259.99 },
    { date: '9월', price: 239.99 },
    { date: '10월', price: 224.99 },
    { date: '11월', price: 199.99 },
  ],
};

const mockProduct: ProductDetail = {
  id: 'mock',
  title: 'Apple AirPods Pro (2nd Generation)',
  image:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  storeLink: 'https://amazon.com',
  price: 199.99,
  originalPrice: 249.99,
  change: '-20.0% ($-50.00)',
  targetPrice: 189.99,
  alertEnabled: true,
};

const formatCurrency = (value: number) =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const ProductDetailScreen = ({ route }: any) => {
  const { productId } = route.params || {};
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [history, setHistory] = useState<PriceHistoryItem[]>(mockHistory.day);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState(''); // 입력 문자열
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [range, setRange] = useState<Range>('day');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 1200);
  };

  const fetchProductDetail = useCallback(
    async (id: string) => {
      // TODO: 백엔드 연동 시 Supabase/Keepa 호출로 교체
      setLoading(true);
      setProduct(mockProduct);
      setTargetPriceInput(
        mockProduct.targetPrice ? formatCurrency(mockProduct.targetPrice) : ''
      );
      setAlertEnabled(mockProduct.alertEnabled ?? true);
      showToast('현재는 모의 데이터로 표시 중이에요');
      setLoading(false);
    },
    []
  );

  const fetchPriceHistory = useCallback(async (id: string, nextRange: Range) => {
    // TODO: 백엔드 연동 시 Supabase 호출로 교체
    setHistoryLoading(true);
    setHistory(mockHistory[nextRange]);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    if (!productId) return;
    fetchProductDetail(productId);
  }, [productId, fetchProductDetail]);

  useEffect(() => {
    if (!productId) return;
    fetchPriceHistory(productId, range);
  }, [productId, range, fetchPriceHistory]);

  const onChangeRange = (next: Range) => {
    setRange(next);
  };

  const onChangeTargetPrice = (text: string) => {
    const cleaned = text.replace(/,/g, '');
    if (!/^\d*(\.\d{0,2})?$/.test(cleaned)) {
      showToast('숫자와 소수점 둘째 자리까지만 입력해 주세요');
      return;
    }
    setTargetPriceInput(cleaned); // 입력 중에는 포맷하지 않음
  };

  const onUpdateAlert = () => {
    setTargetPriceInput(prev =>
      prev || (product?.targetPrice ? formatCurrency(product.targetPrice) : '')
    );
    setShowTargetModal(true);
  };

  const persistTargetPrice = async (numeric: number) => {
    // TODO: 백엔드 연동 시 API 호출로 교체
    return Promise.resolve(numeric);
  };

  const onSaveTargetPrice = async () => {
    if (!targetPriceInput.trim()) {
      showToast('목표 금액을 입력해 주세요');
      return;
    }
    const numeric = parseFloat(targetPriceInput.replace(/,/g, '') || '0');
    if (!Number.isFinite(numeric)) {
      showToast('유효한 숫자를 입력해 주세요');
      return;
    }
    setIsSavingTarget(true);
    try {
      await persistTargetPrice(numeric);
      setTargetPriceInput(formatCurrency(numeric));
      setProduct(prev => (prev ? { ...prev, targetPrice: numeric } : prev));
      setShowTargetModal(false);
      showToast('목표가를 저장했어요');
    } catch (err) {
      console.warn('Failed to save target price', err);
      showToast('목표가 저장에 실패했어요');
    } finally {
      setIsSavingTarget(false);
    }
  };

  const persistAlertStatus = async (enabled: boolean, token?: string | null) => {
    // TODO: 백엔드 연동 시 API 호출로 교체
    return Promise.resolve({ enabled, token });
  };

  const onToggleAlert = async () => {
    const next = !alertEnabled;
    try {
      await persistAlertStatus(next, null);
      setAlertEnabled(next);
      showToast(next ? '알림을 켰어요' : '알림을 껐어요');
    } catch (err) {
      console.warn('Failed to toggle alert', err);
      showToast('알림 설정을 변경할 수 없어요');
    }
  };

  const formattedTarget =
    targetPriceInput ||
    (product?.targetPrice && !Number.isNaN(product.targetPrice)
      ? formatCurrency(product.targetPrice)
      : '');
  const priceDisplay = product
    ? {
        price: `$${formatCurrency(product.price)}`,
        original: `$${formatCurrency(product.originalPrice)}`,
        change: product.change,
      }
    : {
        price: '$0.00',
        original: '$0.00',
        change: '',
      };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image source={{ uri: product?.image ?? mockProduct.image }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{product?.title ?? '상품 정보를 불러오는 중'}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (product?.storeLink) Linking.openURL(product.storeLink);
                }}
              >
                <Text style={styles.link}>스토어에서 보기 ↗</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.bell, alertEnabled ? styles.bellOn : styles.bellOff]}
              onPress={onToggleAlert}
            >
              <Text style={styles.bellText}>🔔</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{priceDisplay.price}</Text>
            <Text style={styles.originalPrice}>{priceDisplay.original}</Text>
          </View>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>변동 {priceDisplay.change}</Text>
          </View>
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#1a73e8" size="small" />
              <Text style={styles.loadingText}>불러오는 중...</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>가격 변동</Text>
            <View style={styles.rangeRow}>
              {['day', 'week', 'month'].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.rangeBtn, range === r ? styles.rangeBtnActive : null]}
                  onPress={() => onChangeRange(r as Range)}
                  disabled={historyLoading}
                >
                  <Text style={[styles.rangeText, range === r ? styles.rangeTextActive : null]}>
                    {r === 'day' ? '일' : r === 'week' ? '주' : '월'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            {historyLoading ? (
              <View style={styles.historyLoading}>
                <ActivityIndicator color="#1a73e8" size="small" />
                <Text style={styles.chartText}>가격 히스토리를 불러오는 중...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.chartText}>차트 자리 (예: VictoryLine)</Text>
                {history.map(item => (
                  <Text key={`${item.date}-${item.price}`} style={styles.chartItem}>
                    {`${item.date} · $${formatCurrency(item.price)}`}
                  </Text>
                ))}
              </>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>가격 알림</Text>
            <View style={styles.alertBadgeRow}>
              <View style={[styles.badgePill, alertEnabled ? styles.badgeOn : styles.badgeOff]}>
                <Text
                  style={[
                    styles.badgeText,
                    alertEnabled ? styles.badgeTextOn : styles.badgeTextOff,
                  ]}
                >
                  {alertEnabled ? '알림 ON' : '알림 OFF'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.alertBox}>
            <Text style={styles.alertLabel}>목표 가격</Text>
            <View style={styles.alertValueBox}>
              <Text style={styles.alertValue}>$ {formattedTarget || '—'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={onUpdateAlert}>
            <Text style={styles.primaryBtnText}>목표 가격 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>리퍼비시 상품</Text>
          <View style={styles.refurbItem}>
            <View>
              <Text style={styles.refurbTitle}>Amazon Renewed</Text>
              <Text style={styles.refurbPrice}>$159.99</Text>
              <Text style={styles.refurbSub}>정품 대비 $40.00 저렴</Text>
            </View>
            <View style={styles.badgeCert}>
              <Text style={styles.badgeCertText}>인증됨</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showTargetModal}
        onRequestClose={() => setShowTargetModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTargetModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>목표 가격 변경</Text>
                <Text style={styles.modalLabel}>목표 가격</Text>
                <TextInput
                  style={styles.modalInput}
                  value={targetPriceInput}
                  onChangeText={onChangeTargetPrice}
                  keyboardType="decimal-pad"
                  autoFocus
                />
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setShowTargetModal(false)}
                  >
                    <Text style={styles.modalCancelText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalSubmit,
                      (!targetPriceInput.trim() || isSavingTarget) && styles.modalSubmitDisabled,
                    ]}
                    onPress={onSaveTargetPrice}
                    disabled={!targetPriceInput.trim() || isSavingTarget}
                  >
                    {isSavingTarget ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalSubmitText}>저장</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {toast && (
        <TouchableWithoutFeedback onPress={() => setToast(null)}>
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 72, height: 72, borderRadius: 12, marginRight: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  link: { marginTop: 6, color: '#2563eb', fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 },
  price: { fontSize: 22, fontWeight: '800', color: '#111827' },
  originalPrice: { fontSize: 16, color: '#9ca3af', textDecorationLine: 'line-through' },
  badgeRow: { marginTop: 8 },
  badge: { color: '#1fa76f', fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  rangeRow: { flexDirection: 'row', gap: 8 },
  rangeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#eef2ff' },
  rangeBtnActive: { backgroundColor: '#1a73e8' },
  rangeText: { color: '#1d4ed8', fontWeight: '700' },
  rangeTextActive: { color: '#fff' },
  chartPlaceholder: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartText: { color: '#6b7280', marginBottom: 6 },
  chartItem: { color: '#4b5563', fontSize: 13 },
  bell: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
  },
  bellOn: { backgroundColor: '#e8f8f1' },
  bellOff: { backgroundColor: '#f4f4f5' },
  bellText: { fontSize: 16 },
  alertBox: {
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  alertLabel: { color: '#1f2937', marginBottom: 5, fontWeight: '600' },
  alertValueBox: {
    backgroundColor: '#f0f6ff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  alertValue: { fontSize: 20, fontWeight: '800', color: '#093eb8ff' },
  primaryBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  refurbItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  refurbTitle: { fontWeight: '700', color: '#9a3412', marginBottom: 4 },
  refurbPrice: { fontSize: 18, fontWeight: '800', color: '#b45309' },
  refurbSub: { color: '#9a3412', marginTop: 2 },
  badgeCert: {
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  badgeCertText: { color: '#92400e', fontWeight: '600', fontSize: 12 },
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
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  modalLabel: { marginTop: 6, marginBottom: 6, color: '#374151', fontWeight: '600' },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 12,
  },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 4 },
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
  modalSubmitDisabled: { backgroundColor: '#93c5fd' },
  modalSubmitText: { color: '#fff', fontWeight: '800' },
  toast: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  toastText: { color: '#fff', fontWeight: '700' },
  historyLoading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  loadingText: { color: '#6b7280' },
  alertBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeOn: { backgroundColor: '#e8f8f1', borderColor: '#98e0c0' },
  badgeOff: { backgroundColor: '#f4f4f5', borderColor: '#e5e7eb' },
  badgeText: { fontWeight: '700', fontSize: 13 },
  badgeTextOn: { color: '#15803d' },
  badgeTextOff: { color: '#6b7280' },
});

export default ProductDetailScreen;
