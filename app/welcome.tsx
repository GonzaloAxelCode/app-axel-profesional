import { useAuthStore } from "@/State/store/useAuthStore";
import T from "@/constants/THEME";
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

const { height } = Dimensions.get('window');

// ─── Feature Item ─────────────────────────────────────────────
function FeatureItem({ icon, text, color }: { icon: string; text: string; color: string }) {
    return (
        <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                <Icon name={icon as any} size={16} color={color} />
            </View>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

// ─── Stat Pill ────────────────────────────────────────────────
function StatPill({ num, label }: { num: string; label: string }) {
    return (
        <View style={styles.statPill}>
            <Text style={styles.statNum}>{num}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────
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
            Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, damping: 18, stiffness: 120, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 120, useNativeDriver: true }),
        ]).start();
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>

            {/* BG */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />

            <Animated.View style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>

                {/* Logo */}
                <View style={styles.logoArea}>
                    <View style={styles.logoIcon}>
                        <Icon name="store-outline" size={30} color={T.bg} />
                    </View>
                    <Text style={styles.brandName}>Inventario</Text>
                </View>

                {/* Headline */}
                <View style={styles.headlineArea}>
                    <Text style={styles.headline}>
                        Gestiona tu{'\n'}negocio con{'\n'}
                        <Text style={styles.headlineAccent}>inteligencia</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Ventas, inventario y clientes en un solo lugar.
                    </Text>
                </View>

                {/* Stats */}
                <Animated.View style={[styles.statsRow, { transform: [{ scale: scaleAnim }] }]}>
                    <StatPill num="1,284" label="Ventas" />
                    <StatPill num="342" label="Productos" />
                    <StatPill num="98" label="Clientes" />
                </Animated.View>

                {/* Features */}
                <View style={styles.featuresCard}>
                    <FeatureItem icon="lightning-bolt" text="SUNAT electrónico" color={T.accent} />
                    <FeatureItem icon="chart-bar" text="Reportes en tiempo real" color={T.accent2} />
                    <FeatureItem icon="account-group-outline" text="Clientes y proveedores" color={T.accent3} />
                    <FeatureItem icon="package-variant-closed" text="Control de stock" color={T.accent4} />
                </View>

            </Animated.View>

            {/* CTA */}
            <Animated.View style={[styles.bottomArea, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => router.replace("/login")}
                >
                    <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnSecondary}>
                    <Text style={styles.btnSecondaryText}>Crear cuenta</Text>
                </TouchableOpacity>

                <Text style={styles.terms}>
                    Al continuar aceptas los términos y privacidad
                </Text>
            </Animated.View>

        </View>
    );
}

// ─── STYLES ───────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: T.bg,
        justifyContent: 'space-between',
        paddingBottom: 48,
    },

    bgCircle1: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: T.accent + '10',
        top: -80,
        right: -80,
    },
    bgCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: T.accent2 + '10',
        bottom: 120,
        left: -60,
    },

    content: {
        paddingTop: 80,
        paddingHorizontal: 24,
    },

    logoArea: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    logoIcon: {
        width: 52,
        height: 52,
        borderRadius: T.radiusMd,
        backgroundColor: T.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...T.shadowAccent,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '800',
        color: T.textPrimary,
        marginLeft: 14,
    },

    headlineArea: { marginBottom: 28 },
    headline: {
        fontSize: 42,
        fontWeight: '900',
        color: T.textPrimary,
        lineHeight: 48,
    },
    headlineAccent: { color: T.accent },
    subtitle: {
        fontSize: 15,
        color: T.textSecondary,
        marginTop: 10,
    },

    statsRow: {
        flexDirection: 'row',
        backgroundColor: T.surfaceElevated,
        borderRadius: T.radiusLg,
        paddingVertical: 18,
        marginBottom: 20,
        justifyContent: 'space-around',
        ...T.shadowCard,
    },
    statPill: { alignItems: 'center' },
    statNum: {
        fontSize: 22,
        fontWeight: '800',
        color: T.textPrimary,
    },
    statLabel: {
        fontSize: 10,
        color: T.textMuted,
        marginTop: 4,
    },

    featuresCard: {
        backgroundColor: T.surface,
        borderRadius: T.radiusLg,
        padding: 16,
        gap: 12,
        ...T.shadowCard,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    featureText: {
        fontSize: 13,
        color: T.textSecondary,
        flex: 1,
    },

    bottomArea: {
        paddingHorizontal: 24,
        gap: 12,
    },
    btnPrimary: {
        backgroundColor: T.accent,
        borderRadius: T.radiusMd,
        paddingVertical: 16,
        alignItems: 'center',
        ...T.shadowAccent,
    },
    btnPrimaryText: {
        color: T.bg,
        fontWeight: '800',
        fontSize: 16,
    },
    btnSecondary: {
        borderRadius: T.radiusMd,
        paddingVertical: 14,
        backgroundColor: T.surface,
        alignItems: 'center',
    },
    btnSecondaryText: {
        color: T.textSecondary,
        fontWeight: '600',
    },
    terms: {
        fontSize: 11,
        color: T.textMuted,
        textAlign: 'center',
    },
});