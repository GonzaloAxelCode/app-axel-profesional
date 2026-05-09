/**
 * VentasChart — 4 secciones apiladas verticalmente, sin tabs
 *
 * Hoy    → Número grande con comparativa ayer
 * Semana → Barras verticales animadas (spring)
 * Mes    → Área + línea suavizada (bezier), toca para ver detalle
 * Año    → Dona interactiva con leyenda por mes
 *
 * Dependencia: npx expo install react-native-svg
 */
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, {
    Circle,
    Defs,
    Line,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg';

import { useVentas } from '@/State/hooks/useVentas';
import T from '@/constants/THEME';




// ─── Tipos ────────────────────────────────────────────────────────────────────
type RawEntry = [string, number];
interface DayPoint { label: string; value: number }

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

function groupToday(raw: RawEntry[]): number {
    const hoy = new Date();
    const found = raw.find(([k]) => matchDay(k, hoy));
    return found?.[1] ?? 0;
}

function groupYesterday(raw: RawEntry[]): number {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const found = raw.find(([k]) => matchDay(k, ayer));
    return found?.[1] ?? 0;
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

// ─── Constantes ───────────────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get('window').width;
const PAD_H = 16;
const GRID_R = [0.25, 0.5, 0.75, 1];

// ── Separador de sección ──────────────────────────────────────────────────────
function SectionLabel({ title }: { title: string }) {
    return (
        <View style={st.sectionHdr}>
            <Text style={st.sectionTitle}>{title}</Text>
            <View style={st.sectionLine} />
        </View>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 0 — HOY
// ══════════════════════════════════════════════════════════════════════════════
function TodaySection({ raw }: { raw: RawEntry[] }) {
    const today = groupToday(raw);
    const ayer = groupYesterday(raw);
    const diff = ayer > 0 ? Math.round(((today - ayer) / ayer) * 100) : null;
    const up = diff !== null && diff >= 0;

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.04, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={st.todayWrap}>
            <View style={{ flex: 1 }}>
                <View style={st.todayLiveRow}>
                    <Animated.View style={[st.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                    <Text style={st.todayLiveTxt}>EN VIVO</Text>
                </View>
                <Text style={st.todayAmount}>{fmtMoney(today)}</Text>
                {diff !== null && (
                    <Text style={[st.todayDiff, { color: up ? '#3B6D11' : '#A32D2D' }]}>
                        {up ? '▲' : '▼'} {up ? '+' : ''}{diff}% vs ayer
                    </Text>
                )}
            </View>
            <View style={st.todayAyerBox}>
                <Text style={st.todayAyerLbl}>Ayer</Text>
                <Text style={st.todayAyerVal}>{fmtMoney(ayer)}</Text>
            </View>
        </View>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 1 — SEMANA: Barras verticales animadas
// ══════════════════════════════════════════════════════════════════════════════
const BAR_H = 160;
const BAR_PAD_T = 28;
const BAR_USABLE = BAR_H - BAR_PAD_T;
const LBL_H = 22;

function WeekBar({
    value, maxVal, label, barW, isActive, onPress, delay,
}: {
    value: number; maxVal: number; label: string; barW: number;
    isActive: boolean; onPress: () => void; delay: number;
}) {
    const anim = useRef(new Animated.Value(0)).current;
    const pct = maxVal > 0 ? Math.min(value / maxVal, 1) : 0;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: pct, useNativeDriver: false,
            tension: 65, friction: 9, delay,
        }).start();
    }, [pct]);

    const barHAnim = anim.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_USABLE] });
    const iW = Math.max(Math.floor(barW * 0.62), 6);
    const iX = Math.floor((barW - iW) / 2);
    const fillColor = isActive ? T.accent : T.accent + 'BB';
    const trackColor = T.accent + '18';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{ width: barW, height: BAR_H + LBL_H }}
        >
            {isActive && value > 0 && (
                <View style={[st.tooltip, { left: iX - 4, width: iW + 8 }]}>
                    <Text style={st.ttTxt} numberOfLines={1}>{fmtMoney(value)}</Text>
                </View>
            )}
            <View style={{
                position: 'absolute', bottom: LBL_H, left: iX,
                width: iW, height: BAR_USABLE,
                borderRadius: T.radiusSm, backgroundColor: trackColor,
            }} />
            <Animated.View style={{
                position: 'absolute', bottom: LBL_H, left: iX,
                width: iW, height: barHAnim,
                borderRadius: T.radiusSm, backgroundColor: fillColor, overflow: 'hidden',
            }}>
                <View style={st.shine} />
            </Animated.View>
            <View style={st.lblRow}>
                <Text style={[st.lbl, isActive && { color: T.accent, fontWeight: '700' }]} numberOfLines={1}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

function WeekChart({ data }: { data: DayPoint[] }) {
    const [active, setActive] = useState<number | null>(null);
    if (!data.length) return null;

    const maxVal = data.reduce((m, d) => Math.max(m, d.value), 0) || 1;

    const BAR_W = Math.floor((SCREEN_W - PAD_H * 2 - 4) / data.length);
    const totalW = BAR_W * data.length;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: PAD_H + Math.floor((SCREEN_W - PAD_H * 2 - totalW) / 2),
            }}
        >
            <View style={{ width: totalW }}>

                {/* GRID */}
                <Svg
                    width={totalW}
                    height={BAR_H}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    pointerEvents="none"
                >
                    {GRID_R.map(r => {
                        const y = BAR_PAD_T + BAR_USABLE - r * BAR_USABLE;

                        return (
                            <React.Fragment key={r}>
                                <Line
                                    x1={0}
                                    y1={y}
                                    x2={totalW}
                                    y2={y}
                                    stroke={T.borderMedium}
                                    strokeWidth={0.5}
                                    opacity={r === 1 ? 0.9 : 0.4}
                                />
                                <SvgText
                                    x={totalW - 2}
                                    y={y - 3}
                                    textAnchor="end"
                                    fontSize={8}
                                    fill={T.textMuted}
                                    opacity={0.65}
                                >
                                    {fmtMoney(maxVal * r)}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}
                </Svg>

                {/* BARS */}
                <View style={{ flexDirection: 'row', height: BAR_H + LBL_H }}>
                    {data.map((pt, i) => (
                        <WeekBar
                            key={i}
                            value={pt.value}
                            maxVal={maxVal}
                            label={pt.label}
                            barW={BAR_W}
                            isActive={active === i}
                            onPress={() => setActive(p => (p === i ? null : i))}
                            delay={i * 28}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 2 — MES: Área + línea bezier
// ══════════════════════════════════════════════════════════════════════════════
const LINE_H = 190;
const LINE_PAD_T = 20;
const LINE_PAD_B = 26;
const LINE_USABLE = LINE_H - LINE_PAD_T - LINE_PAD_B;
const LINE_COLOR = '#1D9E75';

function buildBezier(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    const t = 0.35;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(i + 2, pts.length - 1)];
        d += ` C ${p1.x + (p2.x - p0.x) * t} ${p1.y + (p2.y - p0.y) * t},`
            + ` ${p2.x - (p3.x - p1.x) * t} ${p2.y - (p3.y - p1.y) * t},`
            + ` ${p2.x} ${p2.y}`;
    }
    return d;
}

function MonthChart({ data }: { data: DayPoint[] }) {
    const [selIdx, setSelIdx] = useState<number | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
        }).start();
    }, []);

    if (!data.length) return null;

    const BASE_W = SCREEN_W - PAD_H * 2;

    const maxVal = data.reduce((m, d) => Math.max(m, d.value), 0) || 1;

    // 👇 clave: hacemos que cada punto tenga su espacio real
    const MIN_STEP = 28;
    const stepX = Math.max(BASE_W / (data.length - 1), MIN_STEP);
    const chartW = stepX * (data.length - 1);

    const pts = data.map((d, i) => ({
        x: i * stepX,
        y: LINE_PAD_T + LINE_USABLE - (d.value / maxVal) * LINE_USABLE,
    }));

    const linePath = buildBezier(pts);

    const areaPath =
        linePath +
        ` L ${pts[pts.length - 1].x} ${LINE_H - LINE_PAD_B}` +
        ` L ${pts[0].x} ${LINE_H - LINE_PAD_B} Z`;

    const tickEvery = Math.ceil(data.length / 6);

    const ticks = data
        .map((d, i) => ({
            label: d.label,
            x: i * stepX,
            show: i % tickEvery === 0 || i === data.length - 1,
        }))
        .filter(t => t.show);

    const sel = selIdx !== null ? data[selIdx] : null;

    const h1 = data.slice(0, 15).reduce((s, d) => s + d.value, 0);
    const h2 = data.slice(15).reduce((s, d) => s + d.value, 0);
    const pct = Math.round(((h2 - h1) / (h1 || 1)) * 100);
    const up = pct >= 0;

    return (
        <View>
            {/* BADGE */}
            <View style={[st.trendBadge, { backgroundColor: up ? '#EAF3DE' : '#FCEBEB' }]}>
                <Text style={[st.trendTxt, { color: up ? '#3B6D11' : '#A32D2D' }]}>
                    {up ? '▲' : '▼'} {up ? '+' : ''}{pct}% vs quincena anterior
                </Text>
            </View>

            {/* SELECTED */}
            {sel && (
                <View style={st.selRow}>
                    <Text style={st.selLbl}>{sel.label}</Text>
                    <Text style={[st.selVal, { color: LINE_COLOR }]}>
                        {fmtMoney(sel.value)}
                    </Text>
                </View>
            )}

            {/* SCROLL HORIZONTAL */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: PAD_H }}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Svg width={chartW} height={LINE_H}>
                        <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={LINE_COLOR} stopOpacity="0.22" />
                                <Stop offset="1" stopColor={LINE_COLOR} stopOpacity="0.02" />
                            </LinearGradient>
                        </Defs>

                        {/* GRID */}
                        {GRID_R.map(r => {
                            const y = LINE_PAD_T + LINE_USABLE - r * LINE_USABLE;

                            return (
                                <React.Fragment key={r}>
                                    <Line
                                        x1={0}
                                        y1={y}
                                        x2={chartW}
                                        y2={y}
                                        stroke={T.borderMedium}
                                        strokeWidth={0.5}
                                        opacity={0.5}
                                    />
                                    <SvgText
                                        x={chartW - 2}
                                        y={y - 3}
                                        textAnchor="end"
                                        fontSize={8}
                                        fill={T.textMuted}
                                        opacity={0.7}
                                    >
                                        {fmtMoney(maxVal * r)}
                                    </SvgText>
                                </React.Fragment>
                            );
                        })}

                        {/* AREA + LINE */}
                        <Path d={areaPath} fill="url(#grad)" />
                        <Path
                            d={linePath}
                            stroke={LINE_COLOR}
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* SELECTION LINE */}
                        {selIdx !== null && (
                            <Line
                                x1={pts[selIdx].x}
                                y1={LINE_PAD_T}
                                x2={pts[selIdx].x}
                                y2={LINE_H - LINE_PAD_B}
                                stroke={LINE_COLOR}
                                strokeWidth={1}
                                strokeDasharray="4,3"
                                opacity={0.7}
                            />
                        )}

                        {/* TOUCH AREAS */}
                        {pts.map((p, i) => (
                            <Rect
                                key={i}
                                x={p.x - stepX / 2}
                                y={LINE_PAD_T}
                                width={stepX}
                                height={LINE_USABLE}
                                fill="transparent"
                                onPress={() =>
                                    setSelIdx(prev => (prev === i ? null : i))
                                }
                            />
                        ))}

                        {/* ACTIVE POINT */}
                        {selIdx !== null && (
                            <>
                                <Circle
                                    cx={pts[selIdx].x}
                                    cy={pts[selIdx].y}
                                    r={8}
                                    fill={LINE_COLOR}
                                    opacity={0.18}
                                />
                                <Circle
                                    cx={pts[selIdx].x}
                                    cy={pts[selIdx].y}
                                    r={4}
                                    fill={LINE_COLOR}
                                />
                            </>
                        )}

                        {/* LABELS */}
                        {ticks.map(t => (
                            <SvgText
                                key={t.x}
                                x={t.x}
                                y={LINE_H - 4}
                                textAnchor="middle"
                                fontSize={9}
                                fill={T.textMuted}
                                opacity={0.8}
                            >
                                {t.label}
                            </SvgText>
                        ))}
                    </Svg>
                </Animated.View>
            </ScrollView>

            <Text style={st.hint}>
                Toca la línea para ver el detalle del día
            </Text>
        </View>
    );
}
// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 3 — AÑO: Dona interactiva con leyenda
// ══════════════════════════════════════════════════════════════════════════════
const DONUT_PALETTE = [
    T.accent, T.accent + 'CC', T.accent + '99', T.accent + '77',
    '#1D9E75', '#5DCAA5', '#9FE1CB',
    '#D85A30', '#F0997B',
    '#BA7517', '#EF9F27', '#FAC775',
];

function polarXY(cx: number, cy: number, r: number, deg: number) {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function buildArc(cx: number, cy: number, rO: number, rI: number, a1: number, a2: number): string {
    const p1 = polarXY(cx, cy, rO, a1);
    const p2 = polarXY(cx, cy, rO, a2);
    const p3 = polarXY(cx, cy, rI, a2);
    const p4 = polarXY(cx, cy, rI, a1);
    const lg = a2 - a1 > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${rO} ${rO} 0 ${lg} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rI} ${rI} 0 ${lg} 0 ${p4.x} ${p4.y} Z`;
}

function DonutSegment({
    path, color, isActive, onPress, SZ,
}: {
    path: string; color: string; isActive: boolean; onPress: () => void; SZ: number;
}) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: isActive ? 1.07 : 1,
            useNativeDriver: true, tension: 80, friction: 7,
        }).start();
    }, [isActive]);

    return (
        <Animated.View style={{
            position: 'absolute', top: 0, left: 0,
            width: SZ, height: SZ, transform: [{ scale }],
        }}>
            <Svg width={SZ} height={SZ}>
                <Path
                    d={path}
                    fill={isActive ? color : color + 'E0'}
                    stroke={T.surface}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    onPress={onPress}
                />
            </Svg>
        </Animated.View>
    );
}

function YearChart({ data }: { data: DayPoint[] }) {
    const [selIdx, setSelIdx] = useState<number | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    if (!data.length) return null;

    const SZ = Math.min(SCREEN_W * 0.44, 185);
    const CX = SZ / 2, CY = SZ / 2;
    const R_O = SZ / 2 - 6;
    const R_I = R_O * 0.60;
    const GAP = 2;

    const total = data.reduce((s, d) => s + d.value, 0) || 1;

    let cursor = 0;
    const segments = data.map((d, i) => {
        const pct = d.value / total;
        const sweep = pct * 360 - GAP;
        const a1 = cursor + GAP / 2;
        const a2 = a1 + sweep;
        cursor += pct * 360;
        return {
            path: buildArc(CX, CY, R_O, R_I, a1, a2),
            color: DONUT_PALETTE[i % DONUT_PALETTE.length],
            pct, ...d,
        };
    });

    const sel = selIdx !== null ? data[selIdx] : null;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>

            <Animated.View style={{ opacity: fadeAnim, width: SZ, height: SZ }}>
                {segments.map((seg, i) => (
                    <DonutSegment
                        key={i}
                        path={seg.path} color={seg.color} SZ={SZ}
                        isActive={selIdx === i}
                        onPress={() => setSelIdx(p => p === i ? null : i)}
                    />
                ))}
                <View style={[st.donutCenter, { width: SZ, height: SZ }]}>
                    {sel ? (
                        <>
                            <Text style={st.centerLbl}>{sel.label}</Text>
                            <Text style={[st.centerVal, { color: segments[selIdx!].color }]}>
                                {fmtMoney(sel.value)}
                            </Text>
                            <Text style={st.centerSub}>{Math.round((sel.value / total) * 100)}%</Text>
                        </>
                    ) : (
                        <>
                            <Text style={st.centerLbl}>Total</Text>
                            <Text style={st.centerVal}>{fmtMoney(total)}</Text>
                            <Text style={st.centerSub}>12 meses</Text>
                        </>
                    )}
                </View>
            </Animated.View>

            <View style={{ flex: 1, gap: 3 }}>
                {data.map((d, i) => {
                    const active = selIdx === i;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={[st.legendRow, active && { backgroundColor: segments[i].color + '18' }]}
                            onPress={() => setSelIdx(p => p === i ? null : i)}
                            activeOpacity={0.7}
                        >
                            <View style={[st.dot, { backgroundColor: segments[i].color }]} />
                            <Text style={[st.legendLbl, active && { color: segments[i].color, fontWeight: '700' }]}>
                                {d.label}
                            </Text>
                            <Text style={st.legendPct}>
                                {Math.round((d.value / total) * 100)}%
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export function VentasChart2() {
    const { ventasPorRangoFechasTienda, loadingVentasPorRango } = useVentas();

    const raw = safeRaw((ventasPorRangoFechasTienda as any)?.salesDateRangePerDay);
    const weekData = groupWeek(raw);
    const monthData = groupMonth(raw);
    const yearData = groupYear(raw);

    if (loadingVentasPorRango) {
        return (
            <View style={[st.wrap, { alignItems: 'center', justifyContent: 'center', minHeight: 120 }]}>
                <Text style={{ color: T.textMuted }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={st.wrap}>




            {/* ── SEMANA ── */}
            <SectionLabel title="ESTA SEMANA" />
            <WeekChart data={weekData} />



            <View style={st.sectionDivider} />

            {/* ── AÑO ── */}
            <SectionLabel title="ÚLTIMOS 12 MESES" />
            <YearChart data={yearData} />

        </View>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    wrap: {
        backgroundColor: T.surface,
        padding: PAD_H,
        paddingBottom: 24,
        borderColor: T.border,
        ...T.shadowCard,
    },

    // Sección
    sectionHdr: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.3,
        color: T.textMuted,
    },
    sectionLine: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: T.border,
    },
    sectionDivider: {
        height: 24,
    },

    // HOY
    todayWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: T.accentDim,
        borderRadius: T.radiusMd,
        padding: 16,
        borderWidth: 1,
        borderColor: T.accent + '20',
    },
    todayLiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: T.accent,
    },
    todayLiveTxt: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        color: T.accent,
    },
    todayAmount: {
        fontSize: 38,
        fontWeight: '800',
        color: T.textPrimary,
        letterSpacing: -1,
        lineHeight: 42,
    },
    todayDiff: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
    },
    todayAyerBox: {
        alignItems: 'flex-end',
    },
    todayAyerLbl: {
        fontSize: 10,
        color: T.textMuted,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    todayAyerVal: {
        fontSize: 18,
        fontWeight: '700',
        color: T.textMuted,
    },

    // Barras
    shine: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '40%', backgroundColor: 'rgba(255,255,255,0.28)', borderRadius: 5,
    },
    lblRow: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: LBL_H, alignItems: 'center', justifyContent: 'center',
    },
    lbl: { fontSize: 11, color: T.textMuted, textAlign: 'center' },
    tooltip: {
        position: 'absolute', top: 4, zIndex: 10,
        backgroundColor: T.textPrimary, borderRadius: T.radiusSm,
        paddingHorizontal: 5, paddingVertical: 3, alignItems: 'center',
    },
    ttTxt: { fontSize: 10, fontWeight: '700', color: T.surface },

    // Línea
    trendBadge: {
        alignSelf: 'flex-start', borderRadius: T.radiusSm,
        paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10,
    },
    trendTxt: { fontSize: 11, fontWeight: '700' },
    selRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'rgba(29,158,117,0.08)', borderRadius: T.radiusSm,
        paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8,
    },
    selLbl: { fontSize: 13, color: T.textMuted, fontWeight: '600' },
    selVal: { fontSize: 14, fontWeight: '800' },
    hint: { fontSize: 10, color: T.textMuted, textAlign: 'center', marginTop: 6, opacity: 0.6 },

    // Dona
    donutCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
    centerLbl: { fontSize: 10, color: T.textMuted, fontWeight: '600', letterSpacing: 0.5 },
    centerVal: { fontSize: 16, fontWeight: '800', color: T.textPrimary, letterSpacing: -0.3 },
    centerSub: { fontSize: 9, color: T.textMuted, marginTop: 2 },
    legendRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 3, paddingHorizontal: 5, borderRadius: 6, gap: 6,
    },
    dot: { width: 8, height: 8, borderRadius: 2 },
    legendLbl: { flex: 1, fontSize: 11, color: T.textMuted },
    legendPct: { fontSize: 11, color: T.textMuted, fontWeight: '600' },
});