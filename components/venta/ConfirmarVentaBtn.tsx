import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';


// ═══════════════════════════════════════════════════════════════════════════════
// ConfirmarVentaBtn.tsx
// ═══════════════════════════════════════════════════════════════════════════════
import { C } from '@/State/utils/c';

interface ConfirmarVentaBtnProps {
  total: number;
  onConfirmar: () => void;
  loading: boolean;
  disabled: boolean;
}

export function ConfirmarVentaBtn({ total, onConfirmar, loading, disabled }: ConfirmarVentaBtnProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && !disabled) {
      Animated.loop(
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ).start();
    } else {
      shimmerAnim.stopAnimation();
    }
  }, [loading, disabled]);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const shimmerTranslate = shimmerAnim.interpolate({ inputRange: [-1, 1], outputRange: [-300, 300] });

  const isOff = loading || disabled;

  return (
    <View style={btnStyles.wrap}>
      <Animated.View style={[btnStyles.outerRing, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirmar}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isOff}
          style={[btnStyles.btn, isOff && btnStyles.btnDisabled]}
        >
          {/* Shimmer sweep */}
          {!isOff && (
            <Animated.View
              style={[btnStyles.shimmer, { transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }] }]}
            />
          )}

          <View style={btnStyles.left}>
            <View style={[btnStyles.iconWrap, isOff && btnStyles.iconWrapDisabled]}>
              {loading ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Icon name="loading" size={18} color={C.bg} />
                </Animated.View>
              ) : (
                <Icon name="check-bold" size={18} color={C.bg} />
              )}
            </View>
            <View>
              <Text style={btnStyles.label}>{loading ? 'Procesando…' : 'Confirmar venta'}</Text>
              {!loading && <Text style={btnStyles.sublabel}>Toca para finalizar</Text>}
            </View>
          </View>

          <View style={btnStyles.priceWrap}>
            <Text style={btnStyles.currency}>S/</Text>
            <Text style={btnStyles.price}>{Number(total).toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const btnStyles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 38, paddingTop: 10 },
  outerRing: {
    borderRadius: 20,
    borderWidth: 1, borderColor: C.border,


    overflow: 'hidden',
  },
  btn: {
    backgroundColor: C.accent, borderRadius: 18,
    paddingVertical: 18, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', overflow: 'hidden',
  },
  btnDisabled: { backgroundColor: C.surfaceAlt },
  shimmer: {
    position: 'absolute', top: 0, bottom: 0, width: 70,
    backgroundColor: 'rgba(255,255,255,0.2)', zIndex: 0,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14, zIndex: 1 },
  iconWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: C.bg + '25',
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapDisabled: { backgroundColor: C.border },
  label: { fontSize: 16, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.2 },
  sublabel: { fontSize: 11, color: C.textSecondary, marginTop: 1, fontWeight: '600' },
  priceWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, zIndex: 1 },
  currency: { fontSize: 14, fontWeight: '700', color: C.textSecondary, marginBottom: 3 },
  price: { fontSize: 26, fontWeight: '900', color: C.textPrimary, letterSpacing: -1 },
});