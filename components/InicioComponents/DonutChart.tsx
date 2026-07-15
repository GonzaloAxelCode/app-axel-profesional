import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { Text } from 'react-native-paper';

const SIZE = 120;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const COLORS = ['#10B981', '#8B5CF6', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];

export function DonutChart() {
    const { T } = useAppTheme();
    const { metodosPago, loadingMetodosPago } = useVentas();

    if (loadingMetodosPago) {
        return (
            <View style={s(T).card}>
                <View style={s(T).skeletonCircle} />
            </View>
        );
    }

    const metodos = metodosPago?.metodos_pago ?? [];
    const totalVentas = metodosPago?.total_ventas ?? 0;
    if (metodos.length === 0) return null;

    const totalCantidad = metodos.reduce((sum, m) => sum + m.cantidad, 0);

    let accumulated = 0;
    const segments = metodos.map((m, i) => {
        const pct = totalCantidad > 0 ? m.cantidad / totalCantidad : 0;
        const strokeDasharray = `${CIRCUMFERENCE * pct} ${CIRCUMFERENCE * (1 - pct)}`;
        const strokeDashoffset = -accumulated * CIRCUMFERENCE;
        accumulated += pct;
        return {
            ...m,
            color: COLORS[i % COLORS.length],
            strokeDasharray,
            strokeDashoffset,
        };
    });

    return (
        <View style={s(T).card}>
            <View style={s(T).header}>
                <View>
                    <Text style={s(T).eye}>MÉTODOS DE PAGO</Text>
                    <Text style={s(T).subtitle}>Distribución del mes</Text>
                </View>
            </View>

            <View style={s(T).chartRow}>
                <View style={s(T).chartWrap}>
                    <Svg width={SIZE} height={SIZE}>
                        <G rotation="-90" originX={SIZE / 2} originY={SIZE / 2}>
                            <Circle
                                cx={SIZE / 2}
                                cy={SIZE / 2}
                                r={RADIUS}
                                fill="none"
                                stroke={T.surfaceAlt}
                                strokeWidth={STROKE}
                            />
                            {segments.map((seg, i) => (
                                <Circle
                                    key={i}
                                    cx={SIZE / 2}
                                    cy={SIZE / 2}
                                    r={RADIUS}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth={STROKE}
                                    strokeDasharray={seg.strokeDasharray}
                                    strokeDashoffset={seg.strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            ))}
                        </G>
                    </Svg>
                    <View style={s(T).centerLabel}>
                        <Text style={s(T).centerValue}>{totalVentas}</Text>
                        <Text style={s(T).centerSub}>ventas</Text>
                    </View>
                </View>

                <View style={s(T).legend}>
                    {segments.map((seg, i) => (
                        <View key={i} style={s(T).legendItem}>
                            <View style={[s(T).legendDot, { backgroundColor: seg.color }]} />
                            <Text style={s(T).legendLabel} numberOfLines={1}>{seg.metodo_pago}</Text>
                            <Text style={s(T).legendValue}>{seg.cantidad}</Text>
                        </View>
                    ))}
                </View>
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
    chartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    chartWrap: {
        position: 'relative',
        width: SIZE,
        height: SIZE,
    },
    centerLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerValue: {
        fontSize: 20,
        fontWeight: '900',
        color: T.textPrimary,
    },
    centerSub: {
        fontSize: 10,
        color: T.textMuted,
    },
    legend: {
        flex: 1,
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        flex: 1,
        fontSize: 12,
        color: T.textSecondary,
    },
    legendValue: {
        fontSize: 12,
        fontWeight: '700',
        color: T.textPrimary,
    },
    skeletonCircle: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: T.surfaceAlt,
    },
});
