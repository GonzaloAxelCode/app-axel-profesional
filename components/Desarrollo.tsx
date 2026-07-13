import { useAppTheme } from '@/State/context/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const PulsingRing = ({ delay = 0, color }: { delay?: number; color: string }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.7,
                        duration: 2400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 2400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
                ]),
            ]),
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 1,
                borderColor: color,
                opacity,
                transform: [{ scale }],
            }}
        />
    );
};

const DrumIcon = ({ styles }: { styles: any }) => {
    const spin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spin, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const rotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.iconContainer}>
            <DrumIconRing delay={0} color={styles.drumRing.borderColor} />
            <DrumIconRing delay={1200} color={styles.drumRing.borderColor} />

            <View style={styles.iconCircle}>
                <Animated.View style={[styles.drumRing, { transform: [{ rotate }] }]}>
                    {[0, 120, 240].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        const r = 10;
                        return (
                            <View
                                key={i}
                                style={[
                                    styles.drumDot,
                                    {
                                        top: 17 + Math.sin(rad) * r - 2.5,
                                        left: 17 + Math.cos(rad) * r - 2.5,
                                    },
                                ]}
                            />
                        );
                    })}
                </Animated.View>
            </View>
        </View>
    );
};

const DrumIconRing = ({ delay = 0, color }: { delay?: number; color: string }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.7,
                        duration: 2400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 2400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
                ]),
            ]),
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 1,
                borderColor: color,
                opacity,
                transform: [{ scale }],
            }}
        />
    );
};

const StatusDot = ({ color }: { color: string }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ]),
        ).start();
    }, []);

    return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, opacity }} />;
};

const ProgressBar = ({ styles }: { styles: any }) => {
    const progress = useRef(new Animated.Value(0)).current;
    const [pct, setPct] = React.useState(0);

    useEffect(() => {
        const id = progress.addListener(({ value }) => setPct(Math.round(value * 100)));

        const loop = () => {
            progress.setValue(0);
            Animated.sequence([
                Animated.timing(progress, {
                    toValue: 0.76,
                    duration: 4500,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: false,
                }),
                Animated.delay(700),
                Animated.timing(progress, {
                    toValue: 0,
                    duration: 600,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: false,
                }),
                Animated.delay(400),
            ]).start(loop);
        };
        loop();

        return () => progress.removeListener(id);
    }, []);

    const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

    return (
        <View style={styles.progressSection}>
            <View style={styles.progressMeta}>
                <Text style={styles.progressLabel}>COMPILANDO</Text>
                <Text style={styles.progressPct}>{pct}%</Text>
            </View>
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width }]} />
            </View>
        </View>
    );
};

const useFadeIn = (delay: number) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(14)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    return { opacity, transform: [{ translateY }] };
};

export default function UnderDevelopment() {
    const { T } = useAppTheme();
    const styles = makeStyles(T);
    const s0 = useFadeIn(80);
    const s1 = useFadeIn(240);
    const s2 = useFadeIn(400);
    const s3 = useFadeIn(540);
    const s4 = useFadeIn(660);
    const router = useRouter();

    return (
        <View style={styles.card}>
            <Animated.View style={[styles.pill, s0]}>
                <StatusDot color={T.green} />
                <Text style={styles.pillText}>EN DESARROLLO</Text>
            </Animated.View>

            <Animated.View style={[styles.iconWrap, s1]}>
                <DrumIcon styles={styles} />
            </Animated.View>

            <Animated.View style={[styles.textBlock, s2]}>
                <Text style={styles.headline}>Módulo en</Text>
                <Text style={[styles.headline, styles.headlineAccent]}>construcción</Text>
                <Text style={styles.subtext}>
                    Pronto estará disponible.{'\n'}Gracias por tu paciencia.
                </Text>
            </Animated.View>

            <Animated.View style={[styles.fullWidth, s3]}>
                <View style={styles.divider} />
            </Animated.View>

            <Animated.View style={[styles.metaRow, s4]}>
                {[
                    { label: 'UI', color: T.accent3 },
                    { label: 'API', color: T.accent2 },
                    { label: 'TEST', color: T.borderMedium },
                ].map(({ label, color }) => (
                    <View key={label} style={styles.metaItem}>
                        <View style={[styles.metaDot, { backgroundColor: color }]} />
                        <Text style={[styles.metaText, { color: color === T.borderMedium ? T.textMuted : T.textSecondary }]}>
                            {label}
                        </Text>
                    </View>
                ))}
            </Animated.View>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
                activeOpacity={0.7}
            >
                <Icon name="arrow-left" size={18} color={T.textPrimary} />
            </TouchableOpacity>
        </View>
    );
}

const makeStyles = (T: any) => StyleSheet.create({
    card: {
        flex: 1,
        width: "100%",
        backgroundColor: T.surface,
        borderRadius: T.radiusXl,
        borderWidth: 1,
        borderColor: T.border,
        paddingVertical: 36,
        paddingHorizontal: 32,
        alignItems: 'center',
        gap: 24,
        ...T.shadowCard,
    },
    backBtn: {
        position: 'absolute',
        top: 60,
        left: 20,
        width: 42,
        height: 42,
        borderRadius: T.radiusFull,
        backgroundColor: T.surfaceElevated,
        borderWidth: 1,
        borderColor: T.border,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        ...T.shadowCard,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: T.borderMedium,
        borderRadius: T.radiusFull,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: T.surfaceElevated,
    },
    pillText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: T.textMuted,
    },
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    iconContainer: {
        width: 72,
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: T.surfaceElevated,
        borderWidth: 1,
        borderColor: T.borderMedium,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drumRing: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1.5,
        borderColor: T.accent3,
        position: 'relative',
    },
    drumDot: {
        position: 'absolute',
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: T.accent3,
    },
    textBlock: {
        alignItems: 'center',
        gap: 4,
    },
    headline: {
        fontSize: 26,
        fontWeight: '800',
        color: T.textPrimary,
        letterSpacing: -0.8,
        lineHeight: 33,
        textAlign: 'center',
    },
    headlineAccent: {
        color: T.accent3,
    },
    subtext: {
        marginTop: 8,
        fontSize: 13,
        color: T.textMuted,
        textAlign: 'center',
        lineHeight: 21,
        letterSpacing: 0.1,
    },
    fullWidth: { width: '100%' },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: T.border,
        marginBottom: 20,
    },
    progressSection: {
        width: '100%',
        gap: 10,
    },
    progressMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        color: T.textMuted,
    },
    progressPct: {
        fontSize: 11,
        fontWeight: '700',
        color: T.accent3,
        letterSpacing: 0.4,
    },
    progressTrack: {
        width: '100%',
        height: 2,
        backgroundColor: T.border,
        borderRadius: T.radiusFull,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: T.accent3,
        borderRadius: T.radiusFull,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    metaText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
});
