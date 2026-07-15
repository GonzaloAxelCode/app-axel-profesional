import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

interface ConfirmarVentaBtnProps {
  total: number;
  onConfirmar: () => void;
  loading: boolean;
  disabled: boolean;
}

function LoadingDots({ color }: { color: string }) {
  const dots = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ])
      )
    );
    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={dotsStyles.row}>
      {dots.map((dot, i) => (
        <Animated.View key={i} style={[dotsStyles.dot, { opacity: dot, backgroundColor: color }]} />
      ))}
    </View>
  );
}

const dotsStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});

export function ConfirmarVentaBtn({
  total,
  onConfirmar,
  loading,
  disabled,
}: ConfirmarVentaBtnProps) {
  const { T } = useAppTheme();

  const scale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const accentGlow = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  const isOff = loading || disabled;

  // ── Pulse when active ──
  useEffect(() => {
    if (!isOff) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.015,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isOff]);

  // ── Accent glow when active ──
  useEffect(() => {
    if (!isOff) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(accentGlow, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(accentGlow, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    } else {
      accentGlow.stopAnimation();
      accentGlow.setValue(0);
    }
  }, [isOff]);

  // ── Check bounce on load complete ──
  useEffect(() => {
    if (!loading && !disabled) {
      checkScale.setValue(0);
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, disabled]);

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  const accentOpacity = accentGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale: Animated.multiply(scale, pulseAnim) }] }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirmar}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={isOff}
          style={[styles.btn, { backgroundColor: isOff ? T.surfaceAlt : T.surface }]}
        >
          {/* ── Accent glow overlay ── */}
          {!isOff && (
            <Animated.View
              style={[
                styles.glowOverlay,
                { backgroundColor: T.accent, opacity: accentOpacity },
              ]}
            />
          )}

          {/* ── Left side: info ── */}
          <View style={styles.infoSide}>
            {loading ? (
              <View style={styles.loadingRow}>
                <Text style={[styles.label, { color: T.textPrimary }]}>Procesando</Text>
                <LoadingDots color={T.accent} />
              </View>
            ) : (
              <>
                <Text
                  style={[styles.label, { color: disabled ? T.textMuted : T.textPrimary }]}
                >
                  {disabled ? 'Sin productos' : 'Confirmar venta'}
                </Text>

                <Text
                  style={[
                    styles.sub,
                    { color: isOff ? T.textDisabled : T.textSecondary },
                  ]}
                >
                  {disabled ? 'Agrega items para continuar' : 'Desliza para finalizar'}
                </Text>

                {!disabled && (
                  <View style={styles.priceRow}>
                    <Text style={[styles.currency, { color: T.textSecondary }]}>S/</Text>
                    <Text style={[styles.amount, { color: T.textPrimary }]}>
                      {total.toFixed(2)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* ── Right side: accent action ── */}
          <View
            style={[
              styles.actionSide,
              {
                backgroundColor: loading
                  ? T.accent
                  : isOff
                  ? T.surfaceAlt
                  : T.accent,
              },
            ]}
          >
            {loading ? (
              <View style={styles.loadingIconWrap}>
                <Icon name="truck-fast-outline" size={22} color={T.surface} />
              </View>
            ) : isOff ? (
              <Icon name="cart-outline" size={24} color={T.textDisabled} />
            ) : (
              <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                <Icon name="arrow-right" size={22} color={T.surface} />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 4,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 18,
    minHeight: 72,
    overflow: 'hidden',
  },

  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },

  infoSide: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingVertical: 14,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  sub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginTop: 6,
  },

  currency: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
  },

  amount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  actionSide: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  loadingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
