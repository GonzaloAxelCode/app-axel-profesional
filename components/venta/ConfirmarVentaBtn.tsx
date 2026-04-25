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
  const shine = useRef(new Animated.Value(-1)).current;

  const isOff = loading || disabled;

  // 🎯 animación loading
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spin.stopAnimation();
      spin.setValue(0);
    }
  }, [loading]);

  // 🎯 shine effect
  useEffect(() => {
    if (!isOff) {
      Animated.loop(
        Animated.timing(shine, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      shine.stopAnimation();
    }
  }, [isOff]);

  const spinInter = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shineX = shine.interpolate({
    inputRange: [-1, 1],
    outputRange: [-250, 250],
  });

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
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
          style={[
            styles.btn,
            {
              backgroundColor: isOff ? T.surface : T.accent,
              borderWidth: isOff ? 1 : 0,
              borderColor: T.border,
            },
          ]}
        >
          {/* SHINE */}
          {!isOff && (
            <Animated.View
              style={[
                styles.shine,
                {
                  transform: [
                    { translateX: shineX },
                    { rotate: '20deg' },
                  ],
                },
              ]}
            />
          )}

          {/* LEFT */}
          <View style={styles.left}>
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: isOff
                    ? T.surfaceAlt
                    : 'rgba(255,255,255,0.2)',
                },
              ]}
            >
              {loading ? (
                <Animated.View style={{ transform: [{ rotate: spinInter }] }}>
                  <Icon
                    name="loading"
                    size={18}
                    color={isOff ? T.textSecondary : T.surface}
                  />
                </Animated.View>
              ) : (
                <Icon
                  name="check-bold"
                  size={18}
                  color={isOff ? T.textSecondary : T.surface}
                />
              )}
            </View>

            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color: isOff ? T.textPrimary : T.surface,
                  },
                ]}
              >
                {loading ? 'Procesando...' : 'Confirmar venta'}
              </Text>

              {!loading && (
                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: isOff
                        ? T.textSecondary
                        : 'rgba(255,255,255,0.85)',
                    },
                  ]}
                >
                  Toca para finalizar
                </Text>
              )}
            </View>
          </View>

          {/* PRICE */}
          <View style={styles.price}>
            <Text
              style={[
                styles.currency,
                {
                  color: isOff
                    ? T.textSecondary
                    : 'rgba(255,255,255,0.85)',
                },
              ]}
            >
              S/
            </Text>

            <Text
              style={[
                styles.amount,
                {
                  color: isOff ? T.textPrimary : T.surface,
                },
              ]}
            >
              {total.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },

  btn: {
    borderRadius: T.radiusLg,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    ...T.shadowAccent,
  },

  shine: {
    position: 'absolute',
    width: 80,
    height: '200%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  icon: {
    width: 38,
    height: 38,
    borderRadius: T.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },

  price: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },

  currency: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  amount: {
    fontSize: 26,
    fontWeight: '900',
  },
});