import { useAuthStore } from "@/State/store/useAuthStore";
import { C } from "@/State/utils/c";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Text } from "react-native-paper";

const { width, height } = Dimensions.get('window');



// ─── Feature Item ─────────────────────────────────────────────────────────────
function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
                <Icon name={icon as any} size={16} color={C.accent} />
            </View>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({ num, label }: { num: string; label: string }) {
    return (
        <View style={styles.statPill}>
            <Text style={styles.statNum}>{num}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// ─── BienvenidaScreen ─────────────────────────────────────────────────────────
export default function BienvenidaScreen() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/inicio");
            return;
        }
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                damping: 18,
                stiffness: 120,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 18,
                stiffness: 120,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>

            {/* Background decorations */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />
            <View style={styles.bgDot} />

            <Animated.View style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>

                {/* Logo / Brand area */}
                <View style={styles.logoArea}>
                    <View style={styles.logoIcon}>
                        <Icon name="store-outline" size={32} color={C.bg} />
                    </View>
                    <Text style={styles.brandName}>Inventario</Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>v2.4.1</Text>
                    </View>
                </View>

                {/* Headline */}
                <View style={styles.headlineArea}>
                    <Text style={styles.headline}>Gestiona tu{'\n'}negocio con{'\n'}
                        <Text style={styles.headlineAccent}>inteligencia</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Ventas, inventario y clientes{'\n'}en un solo lugar.
                    </Text>
                </View>

                {/* Stats row */}
                <Animated.View style={[styles.statsRow, { transform: [{ scale: scaleAnim }] }]}>
                    <StatPill num="1,284" label="Ventas" />
                    <View style={styles.statDivider} />
                    <StatPill num="342" label="Productos" />
                    <View style={styles.statDivider} />
                    <StatPill num="98" label="Clientes" />
                </Animated.View>

                {/* Features */}
                <View style={styles.featuresCard}>
                    <FeatureItem icon="lightning-bolt" text="Comprobantes electrónicos SUNAT" />
                    <FeatureItem icon="chart-bar" text="Reportes y estadísticas en tiempo real" />
                    <FeatureItem icon="account-group-outline" text="Gestión de clientes y proveedores" />
                    <FeatureItem icon="package-variant-closed" text="Control de stock con alertas" />
                </View>

            </Animated.View>

            {/* Bottom CTA */}
            <Animated.View style={[styles.bottomArea, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => router.replace("/login")}
                    activeOpacity={0.88}
                >
                    <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
                    <View style={styles.btnArrow}>
                        <Icon name="arrow-right" size={18} color={C.bg} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnSecondary}
                    activeOpacity={0.7}
                >
                    <Text style={styles.btnSecondaryText}>Crear cuenta nueva</Text>
                </TouchableOpacity>

                <Text style={styles.terms}>
                    Al continuar aceptas los{' '}
                    <Text style={styles.termsLink}>Términos de uso</Text>
                    {' '}y{' '}
                    <Text style={styles.termsLink}>Privacidad</Text>
                </Text>
            </Animated.View>

        </View>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: C.bg,
        justifyContent: 'space-between',
        paddingBottom: 48,
    },

    // BG decorations
    bgCircle1: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: '#c8f13508',
        top: -80,
        right: -80,
    },
    bgCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#6ee7b705',
        bottom: 160,
        left: -60,
    },
    bgDot: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: C.accent,
        top: height * 0.18,
        left: 28,
    },

    content: {
        paddingTop: 72,
        paddingHorizontal: 24,
        flex: 1,
    },

    // Logo
    logoArea: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 44,
    },
    logoIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: C.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandName: {
        fontSize: 22,
        fontWeight: '800',
        color: C.textPrimary,
        marginLeft: 14,
        letterSpacing: -0.5,
    },
    versionBadge: {
        marginLeft: 10,
        backgroundColor: C.surface,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: C.border,
    },
    versionText: {
        fontSize: 10,
        color: C.textMuted,
        fontWeight: '600',
    },

    // Headline
    headlineArea: { marginBottom: 32 },
    headline: {
        fontSize: 46,
        fontWeight: '800',
        color: C.textPrimary,
        letterSpacing: -1.5,
        lineHeight: 52,
        marginBottom: 16,
    },
    headlineAccent: {
        color: C.accent,
    },
    subtitle: {
        fontSize: 16,
        color: C.textSecondary,
        lineHeight: 24,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        backgroundColor: C.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        paddingVertical: 18,
        paddingHorizontal: 8,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statPill: { alignItems: 'center', flex: 1 },
    statNum: {
        fontSize: 22,
        fontWeight: '800',
        color: C.textPrimary,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 10,
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontWeight: '600',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: C.border,
    },

    // Features
    featuresCard: {
        backgroundColor: C.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        padding: 16,
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: C.accent + '15',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: C.accent + '25',
    },
    featureText: {
        fontSize: 13,
        color: C.textSecondary,
        flex: 1,
        fontWeight: '500',
    },

    // Bottom CTA
    bottomArea: {
        paddingHorizontal: 24,
        gap: 12,
    },
    btnPrimary: {
        backgroundColor: C.accent,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimaryText: {
        fontSize: 16,
        fontWeight: '800',
        color: C.bg,
        flex: 1,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    btnArrow: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: C.bg + '30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSecondary: {
        borderRadius: 16,
        paddingVertical: 15,
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: 'center',
    },
    btnSecondaryText: {
        fontSize: 15,
        fontWeight: '600',
        color: C.textSecondary,
    },
    terms: {
        fontSize: 11,
        color: C.textMuted,
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 18,
    },
    termsLink: {
        color: C.textSecondary,
        fontWeight: '600',
    },
});