import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Animated,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';

import GeneralTab from '@/components/InicioComponents/GeneralTab';
import ResumenDiaTab from '@/components/InicioComponents/ResumenDiaTab';
import InventarioTab from '@/components/InicioComponents/InventarioTab';
import ComparacionesTab from '@/components/InicioComponents/ComparacionesTab';

const TABS = [
    { key: 'general', label: 'Estadísticas Generales' },
    { key: 'resumen', label: 'Resumen del Día' },
    { key: 'inventario', label: 'Inventario y Alertas' },
    { key: 'comparaciones', label: 'Comparaciones' },
];

const TAB_SCREENS: Record<string, React.ComponentType<any>> = {
    general: GeneralTab,
    resumen: ResumenDiaTab,
    inventario: InventarioTab,
    comparaciones: ComparacionesTab,
};

export default function InicioScreen() {
    const { T } = useAppTheme();
    const { refreshAll } = useVentas();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const indicatorAnim = useRef(new Animated.Value(0)).current;
    const [tabXs, setTabXs] = useState<number[]>([]);
    const [textWidths, setTextWidths] = useState<number[]>([]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshAll();
        setRefreshing(false);
    }, [refreshAll]);

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
                    <Text style={st.title}>Estadísticas de la tienda</Text>
                    <Text style={st.subtitle}>Resumen de ventas, inventario y rendimiento</Text>
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={T.accent}
                        colors={[T.accent]}
                        progressBackgroundColor={T.surface}
                    />
                }
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
    title: { fontSize: 26, fontWeight: '900', color: '#F5F5F5', letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: '#707070', marginTop: 6, lineHeight: 20 },

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
