import T from '@/constants/THEME';
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
  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isOff = loading || disabled;

  // ── Spin (loading) ──────────────────────────────────────────────
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spin.stopAnimation();
      spin.setValue(0);
    }
  }, [loading]);

  // ── Glow pulse (cuando está activo) ────────────────────────────
  useEffect(() => {
    if (!isOff) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // slide de la línea animada
      Animated.loop(
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // pulse del bloque izquierdo
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      slideAnim.stopAnimation();
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isOff]);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const slideX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 400],
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

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirmar}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={isOff}
          style={[styles.btn, isOff && styles.btnDisabled]}
        >
          {/* SLIDE SHINE — línea que cruza */}
          {!isOff && (
            <Animated.View
              style={[
                styles.shine,
                { transform: [{ translateX: slideX }, { rotate: '15deg' }] },
              ]}
            />
          )}

          {/* BLOQUE IZQUIERDO */}
          <Animated.View
            style={[
              styles.leftBlock,
              isOff && styles.leftBlockDisabled,
              !isOff && { transform: [{ scale: pulseAnim }] },
            ]}
          >
            {loading ? (
              <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                <Icon name="loading" size={24} color="#0A0A0A" />
              </Animated.View>
            ) : (
              <Icon
                name={isOff ? 'cart-off' : 'check-bold'}
                size={24}
                color={isOff ? T.textMuted : '#0A0A0A'}
              />
            )}
          </Animated.View>

          {/* CENTRO */}
          <View style={styles.center}>
            <Animated.Text
              style={[
                styles.label,
                isOff && styles.labelDisabled,
                !isOff && { opacity: glowOpacity },
              ]}
            >
              {loading ? 'Procesando...' : 'Confirmar venta'}
            </Animated.Text>

            {!loading && (
              <Text style={[styles.sub, isOff && { color: T.textDisabled }]}>
                {isOff ? 'Agrega productos para continuar' : 'Toca para finalizar'}
              </Text>
            )}
          </View>

          {/* PRECIO */}
          {!loading && (
            <Animated.View
              style={[
                styles.priceBlock,
                !isOff && { opacity: glowOpacity },
              ]}
            >
              <Text style={[styles.currency, isOff && styles.labelDisabled]}>
                S/
              </Text>
              <Text style={[styles.amount, isOff && styles.labelDisabled]}>
                {total.toFixed(2)}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 5,
    paddingBottom: 20,
    paddingTop: 5,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: T.radiusLg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: T.accent + '60',
    minHeight: 70,
  },

  btnDisabled: {
    backgroundColor: T.surface,
    borderColor: T.border,
  },

  shine: {
    position: 'absolute',
    width: 60,
    height: '300%',
    backgroundColor: 'rgba(202,255,0,0.08)',
    zIndex: 0,
  },

  leftBlock: {
    width: 70,
    alignSelf: 'stretch',
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  leftBlockDisabled: {
    backgroundColor: T.surfaceAlt,
  },

  center: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 3,
    zIndex: 1,
  },

  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F2F2F2',
    letterSpacing: 0.2,
  },

  labelDisabled: {
    color: T.textMuted,
  },

  sub: {
    fontSize: 11,
    fontWeight: '500',
    color: T.textMuted,
  },

  priceBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    paddingRight: 18,
    paddingBottom: 2,
    zIndex: 1,
  },

  currency: {
    fontSize: 13,
    fontWeight: '700',
    color: T.accent,
    marginBottom: 4,
  },

  amount: {
    fontSize: 28,
    fontWeight: '900',
    color: T.accent,
  },
});