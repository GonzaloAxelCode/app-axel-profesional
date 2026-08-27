import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';

import TikTokLives from '@/components/TikTokComponents/TikTokLives';
import TikTokPedidos from '@/components/TikTokComponents/TikTokPedidos';
import TikTokEnvios from '@/components/TikTokComponents/TikTokEnvios';
import TikTokEstadisticas from '@/components/TikTokComponents/TikTokEstadisticas';
import TikTokClientes from '@/components/TikTokComponents/TikTokClientes';

const TABS = [
    { key: 'lives', label: 'Lives' },
    { key: 'pedidos', label: 'Pedidos' },
    { key: 'envios', label: 'Envíos' },
    { key: 'estadisticas', label: 'Estadísticas' },
    { key: 'clientes', label: 'Clientes' },
];

const TAB_SCREENS: Record<string, React.ComponentType<any>> = {
    lives: TikTokLives,
    pedidos: TikTokPedidos,
    envios: TikTokEnvios,
    estadisticas: TikTokEstadisticas,
    clientes: TikTokClientes,
};

export default function TikTokScreen() {
    const { T } = useAppTheme();
    const [activeTab, setActiveTab] = useState(0);
    const indicatorAnim = useRef(new Animated.Value(0)).current;
    const [tabXs, setTabXs] = useState<number[]>([]);
    const [textWidths, setTextWidths] = useState<number[]>([]);

    useEffect(() => {
        Animated.spring(indicatorAnim, {
            toValue: activeTab,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [activeTab]);

    const ActiveScreen = TAB_SCREENS[TABS[activeTab].key];

    const handleTabLayout = (index: number, e: any) => {
        const { x } = e.nativeEvent.layout;
        setTabXs(prev => {
            const next = [...prev];
            next[index] = x;
            return next;
        });
    };

    const handleTextLayout = (index: number, e: any) => {
        const { width } = e.nativeEvent.layout;
        setTextWidths(prev => {
            const next = [...prev];
            next[index] = width;
            return next;
        });
    };

    const indicatorX = indicatorAnim.interpolate({
        inputRange: TABS.map((_, i) => i),
        outputRange: TABS.map((_, i) => {
            const tabX = tabXs[i] || 0;
            const textW = textWidths[i] || 0;
            const tabW = 0;
            return tabX + 16 + (tabW > 0 ? (tabW - textW) / 2 : 0);
        }),
    });

    const indicatorWidth = textWidths[activeTab] || 0;

    return (
        <View style={st.root}>
            {/* Header fijo */}
            <View style={st.headerWrap}>
                <View style={st.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <View style={st.iconWrap}>
                            <Icon name="music-note" size={20} color="#EE1D52" />
                        </View>
                        <View>
                            <Text style={st.title}>TikTok Live</Text>
                            <Text style={st.subtitle}>Ventas en vivo</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs scrollables */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={st.tabsScroll}
                >
                    <View style={st.tabsRow}>
                        {TABS.map((tab, i) => {
                            const focused = activeTab === i;
                            return (
                                <TouchableOpacity
                                    key={tab.key}
                                    onPress={() => setActiveTab(i)}
                                    onLayout={(e) => handleTabLayout(i, e)}
                                    activeOpacity={0.7}
                                    style={st.tab}
                                >
                                    <Text
                                        onLayout={(e) => handleTextLayout(i, e)}
                                        style={[st.tabLabel, { color: focused ? T.accent : T.textMuted }]}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        {indicatorWidth > 0 && (
                            <Animated.View
                                style={[
                                    st.indicator,
                                    {
                                        backgroundColor: T.accent,
                                        width: indicatorWidth,
                                        transform: [{ translateX: indicatorX }],
                                    },
                                ]}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Contenido del tab activo */}
            <ScrollView
                style={st.content}
                contentContainerStyle={st.contentScroll}
                showsVerticalScrollIndicator={false}
            >
                <ActiveScreen />
            </ScrollView>
        </View>
    );
}

const st = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#050505' },

    headerWrap: {
        backgroundColor: '#050505',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 4,
    },

    header: {
        paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, marginBottom: 8,
    },
    iconWrap: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#000000',
        alignItems: 'center', justifyContent: 'center',
    },
    title: { fontSize: 22, fontWeight: '900', color: '#F5F5F5', letterSpacing: -0.5 },
    subtitle: { fontSize: 12, color: '#707070', marginTop: 2 },

    tabsScroll: {
        paddingHorizontal: 16,
    },
    tabsRow: {
        flexDirection: 'row',
        position: 'relative',
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        borderRadius: 2,
    },

    content: {
        flex: 1,
        backgroundColor: '#050505',
    },
    contentScroll: {
        paddingBottom: 120,
    },
});
