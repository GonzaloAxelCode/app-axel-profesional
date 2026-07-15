import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useAppTheme } from '@/State/context/ThemeContext';
import { Text } from 'react-native-paper';

const OBJECTIVES = [
    { label: 'Ventas', current: 92, target: 120, color: '#10B981' },
    { label: 'Clientes', current: 78, target: 100, color: '#3B82F6' },
    { label: 'Satisfacción', current: 87, target: 100, color: '#F59E0B' },
    { label: 'Retención', current: 65, target: 80, color: '#EF4444' },
];

const CIRCLE_SIZE = 56;
const STROKE = 4;
const RADIUS = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressCircles() {
    const { T } = useAppTheme();

    return (
        <View style={s(T).card}>
            <View style={s(T).header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View>
                        <Text style={s(T).eye}>OBJETIVOS DEL MES</Text>
                        <Text style={s(T).subtitle}>Progreso hacia metas</Text>
                    </View>
                </View>
                <View style={s(T).soonBadge}>
                    <Text style={s(T).soonTxt}>Próximamente</Text>
                </View>
            </View>

            <View style={s(T).grid}>
                {OBJECTIVES.map((obj, i) => {
                    const pct = Math.min((obj.current / obj.target) * 100, 100);
                    const filled = (pct / 100) * CIRCUMFERENCE;

                    return (
                        <View key={i} style={s(T).item}>
                            <View style={s(T).circleWrap}>
                                <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                                    <G rotation="-90" originX={CIRCLE_SIZE / 2} originY={CIRCLE_SIZE / 2}>
                                        <Circle
                                            cx={CIRCLE_SIZE / 2}
                                            cy={CIRCLE_SIZE / 2}
                                            r={RADIUS}
                                            fill="none"
                                            stroke={T.surfaceAlt}
                                            strokeWidth={STROKE}
                                        />
                                        <Circle
                                            cx={CIRCLE_SIZE / 2}
                                            cy={CIRCLE_SIZE / 2}
                                            r={RADIUS}
                                            fill="none"
                                            stroke={obj.color}
                                            strokeWidth={STROKE}
                                            strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
                                            strokeLinecap="round"
                                        />
                                    </G>
                                </Svg>
                                <View style={s(T).circleCenter}>
                                    <Text style={s(T).circlePct}>{Math.round(pct)}%</Text>
                                </View>
                            </View>
                            <Text style={s(T).circleLabel}>{obj.label}</Text>
                        </View>
                    );
                })}
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
    soonBadge: {
        backgroundColor: '#8B5CF6' + '18',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    soonTxt: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8B5CF6',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    item: {
        width: '47%',
        alignItems: 'center',
        gap: 6,
    },
    circleWrap: {
        position: 'relative',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
    },
    circleCenter: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circlePct: {
        fontSize: 12,
        fontWeight: '800',
        color: T.textPrimary,
    },
    circleLabel: {
        fontSize: 11,
        color: T.textMuted,
        textAlign: 'center',
    },
});
