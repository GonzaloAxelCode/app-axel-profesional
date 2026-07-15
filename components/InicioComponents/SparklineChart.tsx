import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { Text } from 'react-native-paper';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - 80;
const CHART_H = 100;

export function SparklineChart() {
    const { T } = useAppTheme();
    const { dailyTrend, loadingDailyTrend } = useVentas();

    if (loadingDailyTrend) {
        return (
            <View style={s(T).card}>
                <View style={s(T).skeleton} />
            </View>
        );
    }

    const data = dailyTrend?.results ?? [];
    if (data.length < 2) return null;

    const values = data.map(d => d.total);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    const stepX = CHART_W / (data.length - 1);

    const points = values.map((v, i) => ({
        x: i * stepX,
        y: CHART_H - ((v - minVal) / range) * (CHART_H - 20) - 10,
    }));

    const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    const areaPath = linePath + ` L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`;

    const percentChange = values[0] === 0
        ? (values[values.length - 1] > 0 ? 100 : 0)
        : Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100);

    const firstLabel = data[0]?.fecha?.split('-').slice(1).reverse().join('/') ?? '';
    const lastLabel = data[data.length - 1]?.fecha?.split('-').slice(1).reverse().join('/') ?? '';

    return (
        <View style={s(T).card}>
            <View style={s(T).header}>
                <View>
                    <Text style={s(T).eye}>TENDENCIA DE VENTAS</Text>
                    <Text style={s(T).subtitle}>Últimos {data.length} días</Text>
                </View>
                <View style={[s(T).badge, { backgroundColor: percentChange >= 0 ? T.green + '18' : T.red + '18' }]}>
                    <Text style={[s(T).badgeTxt, { color: percentChange >= 0 ? T.green : T.red }]}>
                        {percentChange >= 0 ? '+' : ''}{percentChange}%
                    </Text>
                </View>
            </View>

            <Svg width={CHART_W} height={CHART_H}>
                <Defs>
                    <LinearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={T.accent} stopOpacity="0.3" />
                        <Stop offset="100%" stopColor={T.accent} stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                <Path d={areaPath} fill="url(#sparkGrad)" />
                <Path d={linePath} fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" />

                {points.map((p, i) => (
                    <Circle key={i} cx={p.x} cy={p.y} r="2.5" fill={T.accent} />
                ))}
            </Svg>

            <View style={s(T).labels}>
                <Text style={s(T).labelText}>{firstLabel}</Text>
                <Text style={[s(T).labelText, { fontWeight: '700', color: percentChange >= 0 ? T.green : T.red }]}>
                    {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange)}%
                </Text>
                <Text style={s(T).labelText}>{lastLabel}</Text>
            </View>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
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
    badge: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeTxt: {
        fontSize: 12,
        fontWeight: '700',
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    labelText: {
        fontSize: 10,
        color: T.textMuted,
    },
    skeleton: {
        height: 140,
        backgroundColor: T.surfaceAlt,
        borderRadius: 12,
    },
});
