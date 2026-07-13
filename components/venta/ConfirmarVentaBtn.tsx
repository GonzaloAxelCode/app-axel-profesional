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

export function ConfirmarVentaBtn({
  total,
  onConfirmar,
  loading,
  disabled,
}: ConfirmarVentaBtnProps) {
  const { T } = useAppTheme();

  const scale = useRef(new Animated.Value(1)).current;
  const shimmerX = useRef(new Animated.Value(-1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinnerRotate = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  const isOff = loading || disabled;

  // ── Loading spinner ──
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinnerRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinnerRotate.stopAnimation();
      spinnerRotate.setValue(0);
    }
  }, [loading]);

  // ── Pulse when active ──
  useEffect(() => {
    if (!isOff) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
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

  // ── Shimmer sweep ──
  useEffect(() => {
    if (!isOff) {
      shimmerX.setValue(-1);
      Animated.loop(
        Animated.timing(shimmerX, {
          toValue: 1,
          duration: 2200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      shimmerX.stopAnimation();
      shimmerX.setValue(-1);
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

  // ── Background fade for disabled ──
  useEffect(() => {
    Animated.timing(bgOpacity, {
      toValue: isOff ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOff]);

  const spin = spinnerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslateX = shimmerX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-250, 450],
  });

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  const spinnerColor = T.bg;

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale: Animated.multiply(scale, pulseAnim) }] }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirmar}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={isOff}
          style={[
            styles.btn,
            { backgroundColor: isOff ? T.surfaceAlt : T.accent },
            isOff && { borderWidth: 1, borderColor: T.border },
          ]}
        >
          {/* Shimmer line */}
          {!isOff && (
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerTranslateX }, { rotate: '20deg' }],
                },
              ]}
            />
          )}

          {/* Disabled overlay */}
          {isOff && (
            <Animated.View
              style={[styles.disabledOverlay, { opacity: bgOpacity, backgroundColor: T.surfaceAlt }]}
            />
          )}

          {/* Icon */}
          <View style={[
            styles.iconWrap,
            { backgroundColor: isOff ? T.surface : 'rgba(255,255,255,0.18)' },
          ]}>
            {loading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Icon name="loading" size={22} color={spinnerColor} />
              </Animated.View>
            ) : isOff ? (
              <Icon name="cart-outline" size={22} color={T.textMuted} />
            ) : (
              <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                <Icon name="check" size={22} color={T.bg} strokeWidth={3} />
              </Animated.View>
            )}
          </View>

          {/* Label */}
          <View style={styles.labelWrap}>
            <Text style={[
              styles.label,
              { color: isOff ? T.textMuted : T.bg },
            ]}>
              {loading ? 'Procesando...' : disabled ? 'Sin productos' : 'Confirmar venta'}
            </Text>
            {!loading && (
              <Text style={[styles.sub, { color: isOff ? T.textDisabled : 'rgba(255,255,255,0.55)' }]}>
                {disabled ? 'Agrega items para continuar' : 'Desliza para finalizar'}
              </Text>
            )}
          </View>

          {/* Price */}
          {!loading && (
            <View style={styles.priceWrap}>
              <Text style={[styles.currency, { color: isOff ? T.textDisabled : 'rgba(255,255,255,0.6)' }]}>S/</Text>
              <Text style={[styles.amount, { color: isOff ? T.textMuted : T.bg }]}>
                {total.toFixed(2)}
              </Text>
            </View>
          )}

          {/* Arrow */}
          {!isOff && (
            <View style={styles.arrowWrap}>
              <Icon name="arrow-right" size={18} color={T.bg} />
            </View>
          )}
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
    alignItems: 'center',
    borderRadius: 18,
    minHeight: 64,
    overflow: 'hidden',
  },

  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },

  shimmer: {
    position: 'absolute',
    width: 80,
    height: '300%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    zIndex: 1,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    zIndex: 2,
  },

  labelWrap: {
    flex: 1,
    marginLeft: 14,
    zIndex: 2,
  },

  label: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  sub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  priceWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginRight: 8,
    zIndex: 2,
  },

  currency: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  amount: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  arrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    zIndex: 2,
  },
});
