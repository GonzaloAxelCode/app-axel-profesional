import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { Text } from 'react-native-paper';

const GAUGE_W = 160;
const GAUGE_H = 90;

export function GaugeChart() {
    const { T } = useAppTheme();
    const { satisfaccion, loadingSatisfaccion } = useVentas();

    if (loadingSatisfaccion) {
        return (
            <View style={s(T).card}>
                <View style={s(T).skeleton} />
            </View>
        );
    }

    if (!satisfaccion) return null;

    const { porcentaje, variacion } = satisfaccion;
    const value = Math.min(Math.max(porcentaje, -100), 100);
    const absValue = Math.abs(value);

    // SVG arc path
    const cx = GAUGE_W / 2;
    const cy = GAUGE_H - 5;
    const r = 65;
    const startAngle = Math.PI;
    const endAngle = 0;
    const totalArc = Math.PI;
    const filledArc = (absValue / 100) * totalArc;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const xFill = cx + r * Math.cos(startAngle - filledArc);
    const yFill = cy + r * Math.sin(startAngle - filledArc);

    const bgPath = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    const fillPath = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${xFill} ${yFill}`;

    const isPositive = variacion >= 0;

    return (
        <View style={s(T).card}>
            <View style={s(T).header}>
                <View>
                    <Text style={s(T).eye}>RENDIMIENTO</Text>
                    <Text style={s(T).subtitle}>Comparativa mensual</Text>
                </View>
            </View>

            <View style={s(T).gaugeWrap}>
                <Svg width={GAUGE_W} height={GAUGE_H}>
                    <Defs>
                        <LinearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#EF4444" />
                            <Stop offset="50%" stopColor="#F59E0B" />
                            <Stop offset="100%" stopColor="#10B981" />
                        </LinearGradient>
                    </Defs>

                    <Path d={bgPath} fill="none" stroke={T.surfaceAlt} strokeWidth="10" strokeLinecap="round" />
                    <Path
                        d={fillPath}
                        fill="none"
                        stroke={isPositive ? 'url(#gaugeGrad)' : '#EF4444'}
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                </Svg>

                <View style={s(T).gaugeCenter}>
                    <Text style={[s(T).gaugeValue, { color: isPositive ? T.textPrimary : T.red }]}>
                        {isPositive ? '+' : ''}{Math.round(value)}%
                    </Text>
                </View>
            </View>

            <Text style={[s(T).variacion, { color: isPositive ? T.green : T.red }]}>
                {isPositive ? '+' : ''}{Math.round(variacion)} soles vs mes anterior
            </Text>
        </View>
    );
}

const s = (T: any) => StyleSheet.create({
    card: {
        backgroundColor: T.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: T.border,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        alignSelf: 'stretch',
    },
    eye: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: T.textMuted,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '700',
        color: T.textPrimary,
    },
    gaugeWrap: {
        position: 'relative',
        width: GAUGE_W,
        height: GAUGE_H,
    },
    gaugeCenter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    gaugeValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    variacion: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },
    skeleton: {
        width: GAUGE_W,
        height: GAUGE_H,
        backgroundColor: T.surfaceAlt,
        borderRadius: 20,
    },
});
