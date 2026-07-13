import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

function SectionLabel({ label, T }: { label: string; T: any }) {
    return (
        <Text style={{
            fontSize: 10,
            color: T.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontWeight: '700',
            marginTop: 20,
            marginBottom: 10,
            paddingHorizontal: 20,
        }}>{label}</Text>
    );
}

const categories = [
    { icon: '💻', name: 'Electrónica', count: 12, color: '#3BA7FF' },
    { icon: '👕', name: 'Ropa', count: 8, color: '#FF3CAC' },
    { icon: '🏠', name: 'Hogar', count: 15, color: '#00C9A7' },
    { icon: '⚽', name: 'Deportes', count: 6, color: '#FFB800' },
    { icon: '💄', name: 'Belleza', count: 9, color: '#9B6DFF' },
    { icon: '🍎', name: 'Alimentos', count: 22, color: '#FF4444' },
];

export default function Categorias() {
    const { T } = useAppTheme();
    const router = useRouter();
    const s = makeStyles(T);

    return (
        <View style={s.screen}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Icon name="arrow-left" size={22} color={T.textPrimary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Categorías</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={s.addBtn}>
                    <Icon name="plus" size={18} color={T.accent} />
                    <Text style={[s.addBtnText, { color: T.accent }]}>Nueva categoría</Text>
                </TouchableOpacity>

                <View style={s.group}>
                    {categories.map((cat, i) => (
                        <TouchableOpacity
                            key={cat.name}
                            style={[
                                s.row,
                                i < categories.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.border }
                            ]}
                        >
                            <View style={s.rowLeft}>
                                <View style={[s.iconWrap, { backgroundColor: cat.color + '18' }]}>
                                    <Text style={s.iconEmoji}>{cat.icon}</Text>
                                </View>
                                <View>
                                    <Text style={[s.rowTitle, { color: T.textPrimary }]}>{cat.name}</Text>
                                    <Text style={[s.rowSub, { color: T.textMuted }]}>
                                        {cat.count} productos
                                    </Text>
                                </View>
                            </View>
                            <View style={s.rowRight}>
                                <View style={[s.countBadge, { backgroundColor: cat.color + '20' }]}>
                                    <Text style={[s.countText, { color: cat.color }]}>{cat.count}</Text>
                                </View>
                                <Icon name="chevron-right" size={18} color={T.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function makeStyles(T: any) {
    return StyleSheet.create({
        screen: { flex: 1, backgroundColor: T.bg },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 20,
            paddingTop: 56,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: T.border,
        },
        backBtn: {
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: T.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: T.textPrimary,
        },
        addBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 16,
            backgroundColor: T.accentDim,
            borderRadius: T.radiusLg,
            padding: 14,
            borderWidth: 1,
            borderColor: T.accent + '30',
        },
        addBtnText: {
            fontSize: 14,
            fontWeight: '700',
        },
        group: {
            marginHorizontal: 20,
            backgroundColor: T.surface,
            borderRadius: T.radiusXl,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 14,
        },
        rowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconWrap: {
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconEmoji: {
            fontSize: 20,
        },
        rowTitle: {
            fontSize: 14,
            fontWeight: '700',
        },
        rowSub: {
            fontSize: 12,
            marginTop: 2,
        },
        rowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        countBadge: {
            borderRadius: T.radiusFull,
            paddingHorizontal: 10,
            paddingVertical: 4,
            minWidth: 36,
            alignItems: 'center',
        },
        countText: {
            fontSize: 12,
            fontWeight: '800',
        },
    });
}
