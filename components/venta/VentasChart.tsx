/**
 * VentasChart — tema claro, zero dependencias externas
 */
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useVentas } from '@/State/hooks/useVentas';
import T from '@/constants/THEME';


const SCREEN_W = Dimensions.get('window').width;

// ─── Tipos ────────────────────────────────────────────────────────────────────
type RawEntry = [string, number];
interface DayPoint { label: string; value: number }
type Tab = 'semana' | 'mes' | 'anual';

// ─── Parsers / agrupadores ────────────────────────────────────────────────────
function parseKey(key: string): [number, number, number] {
    const p = String(key).split(',').map(s => parseInt(s.trim(), 10));
    return [p[0] || 0, p[1] || 0, p[2] || 0];
}

function matchDay(key: string, d: Date): boolean {
    const [y, m, day] = parseKey(key);
    return y === d.getFullYear() && m === d.getMonth() && day === d.getDate();
}

function safeRaw(input: unknown): RawEntry[] {
    if (!Array.isArray(input)) return [];
    return input.filter(
        e => Array.isArray(e) && e.length === 2 && typeof e[1] === 'number'
    ) as RawEntry[];
}

function groupWeek(raw: RawEntry[]): DayPoint[] {
    const hoy = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - (6 - i));
        const found = raw.find(([k]) => matchDay(k, d));
        return { label: d.toLocaleDateString('es-PE', { weekday: 'short' }), value: found?.[1] ?? 0 };
    });
}

function groupMonth(raw: RawEntry[]): DayPoint[] {
    const hoy = new Date();
    return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - (29 - i));
        const found = raw.find(([k]) => matchDay(k, d));
        return { label: d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }), value: found?.[1] ?? 0 };
    });
}

function groupYear(raw: RawEntry[]): DayPoint[] {
    const hoy = new Date();
    return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(hoy.getFullYear(), hoy.getMonth() - 11 + i, 1);
        const y = d.getFullYear(), m = d.getMonth();
        const total = raw.reduce((acc, [k, v]) => {
            const [ry, rm] = parseKey(k);
            return ry === y && rm === m ? acc + v : acc;
        }, 0);
        return { label: d.toLocaleDateString('es-PE', { month: 'short', year: '2-digit' }), value: total };
    });
}

function fmtMoney(v: number): string {
    const n = Number(v) || 0;
    return n >= 1000 ? `S/${(n / 1000).toFixed(1)}k` : `S/${n.toFixed(0)}`;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
const CHART_H = 160;
const PAD_TOP = 32;
const USABLE = CHART_H - PAD_TOP;
const LBL_H = 22;

// ─── Grid ─────────────────────────────────────────────────────────────────────
function Grid({ w }: { w: number }) {
    return (
        <>
            {[0.25, 0.5, 0.75, 1].map(r => (
                <View
                    key={r}
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        top: PAD_TOP + USABLE - r * USABLE,
                        left: 0,
                        width: w,
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: T.borderMedium,
                        opacity: r === 1 ? 0.9 : 0.5,
                    }}
                />
            ))}
        </>
    );
}

// ─── Barra ────────────────────────────────────────────────────────────────────
interface BarProps {
    value: number;
    maxVal: number;
    label: string;
    barW: number;
    isActive: boolean;
    onPress: () => void;
    delay: number;
}

function Bar({ value, maxVal, label, barW, isActive, onPress, delay }: BarProps) {
    const anim = useRef(new Animated.Value(0)).current;
    const pct = maxVal > 0 ? Math.min(value / maxVal, 1) : 0;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: pct,
            useNativeDriver: false,
            tension: 65,
            friction: 9,
            delay,
        }).start();
    }, [pct]);

    const barH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, USABLE] });

    const iW = Math.max(Math.floor(barW * 0.62), 4);
    const iX = Math.floor((barW - iW) / 2);

    // Color de la barra: rojo (accent) cuando activa, rojo suave cuando normal
    const fillColor = isActive ? T.accent : T.accent + 'CC';
    const trackColor = T.accent + '14';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{ width: barW, height: CHART_H + LBL_H }}
        >
            {/* Tooltip */}
            {isActive && value > 0 && (
                <View style={[st.tooltip, { left: iX - 4, width: iW + 8 }]}>
                    <Text style={st.ttTxt} numberOfLines={1}>{fmtMoney(value)}</Text>
                </View>
            )}

            {/* Track */}
            <View style={{
                position: 'absolute', bottom: LBL_H,
                left: iX, width: iW, height: USABLE,
                borderRadius: T.radiusSm,
                backgroundColor: trackColor,
            }} />

            {/* Barra animada */}
            <Animated.View style={{
                position: 'absolute', bottom: LBL_H,
                left: iX, width: iW, height: barH,
                borderRadius: T.radiusSm,
                backgroundColor: fillColor,
                overflow: 'hidden',
            }}>
                {/* Brillo superior */}
                <View style={st.shine} />
            </Animated.View>

            {/* Label */}
            <View style={st.lblRow}>
                <Text style={[st.lbl, isActive && { color: T.accent, fontWeight: '700' }]} numberOfLines={1}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// ─── Chart ────────────────────────────────────────────────────────────────────
function Chart({ data }: { data: DayPoint[] }) {
    const [active, setActive] = useState<number | null>(null);
    if (!data.length) return null;

    const maxVal = data.reduce((m, d) => Math.max(m, d.value), 0) || 1;
    const BAR_W = data.length <= 8 ? Math.floor((SCREEN_W - 36) / data.length) : 48;
    const totalW = Math.max(BAR_W * data.length, SCREEN_W - 32);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
            <View style={{ width: totalW, height: CHART_H + LBL_H }}>
                <Grid w={totalW} />
                {data.map((pt, i) => (
                    <View key={i} style={{ position: 'absolute', left: i * BAR_W, top: 0 }}>
                        <Bar
                            value={pt.value}
                            maxVal={maxVal}
                            label={pt.label}
                            barW={BAR_W}
                            isActive={active === i}
                            onPress={() => setActive(p => p === i ? null : i)}
                            delay={i * 22}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string }[] = [
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'anual', label: 'Año' },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export function VentasChart() {
    const [tab, setTab] = useState<Tab>('mes');
    const { ventasPorRangoFechasTienda, loadingVentasPorRango } = useVentas();


    const raw = safeRaw((ventasPorRangoFechasTienda as any)?.salesDateRangePerDay);

    const data: DayPoint[] =
        tab === 'semana' ? groupWeek(raw) :
            tab === 'mes' ? groupMonth(raw) :
                groupYear(raw);

    const total = data.reduce((s, d) => s + d.value, 0);
    const activeDays = data.filter(d => d.value > 0).length;
    if (loadingVentasPorRango) {
        return (
            <View style={st.wrap}>
                <Text style={{ color: T.textMuted }}>Cargando...</Text>
            </View>
        );
    }
    return (
        <View style={st.wrap}>

            {/* Header */}
            <View style={st.hdr}>
                <View style={{ flex: 1 }}>
                    <Text style={st.eye}>VENTAS POR PERÍODO</Text>
                    <Text style={st.tot}>{fmtMoney(total)}</Text>
                </View>
                <View style={st.badge}>
                    <Text style={st.badgeTxt}>{activeDays} días activos</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={st.divider} />

            {/* Tabs */}
            <View style={st.tabsWrap}>
                {TABS.map(t => {
                    const active = tab === t.key;
                    return (
                        <TouchableOpacity
                            key={t.key}
                            style={[st.tab, active && st.tabActive]}
                            onPress={() => setTab(t.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[st.tabTxt, active && st.tabTxtActive]}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Gráfico */}
            <Chart data={data} />

        </View>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    wrap: {
        backgroundColor: T.surface,


        paddingBottom: 16,
        overflow: 'hidden',
        borderWidth: 0,
        borderColor: T.border,
        ...T.shadowCard,
    },

    // Header
    hdr: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    eye: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: T.textMuted,
        marginBottom: 4,
    },
    tot: {
        fontSize: 32,
        fontWeight: '800',
        color: T.textPrimary,
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    badge: {
        borderRadius: T.radiusFull,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: T.accentDim,
        borderWidth: 1,
        borderColor: T.accent + '25',
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    badgeTxt: {
        fontSize: 12,
        fontWeight: '700',
        color: T.accent,
    },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: T.border,
        marginBottom: 14,
    },

    // Tabs
    tabsWrap: {
        flexDirection: 'row',
        backgroundColor: T.surfaceAlt,
        borderRadius: T.radiusMd,
        padding: 3,
        marginBottom: 18,
        gap: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: T.radiusSm,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: T.surface,
        ...T.shadowCard,
    },
    tabTxt: {
        fontSize: 13,
        fontWeight: '500',
        color: T.textMuted,
        letterSpacing: 0.2,
    },
    tabTxtActive: {
        color: T.accent,
        fontWeight: '700',
    },

    // Bar
    shine: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '40%',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 5,
    },
    lblRow: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: LBL_H,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lbl: {
        fontSize: 11,
        color: T.textMuted,
        textAlign: 'center',
    },

    // Tooltip
    tooltip: {
        position: 'absolute',
        top: 4,
        zIndex: 10,
        backgroundColor: T.textPrimary,
        borderRadius: T.radiusSm,
        paddingHorizontal: 5,
        paddingVertical: 3,
        alignItems: 'center',
    },
    ttTxt: {
        fontSize: 10,
        fontWeight: '700',
        color: T.surface,
    },
});