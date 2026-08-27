import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function LowStockStats({ products }: { products: any[] }) {
    const { T } = useAppTheme();

    const total = products.length;
    const criticos = products.filter(p => p.inventario?.cantidad >= 0 && p.inventario?.cantidad <= 3).length;
    const advertencias = products.filter(p => p.inventario?.cantidad > 3 && p.inventario?.cantidad <= 10).length;

    const stats = [
        { label: 'Total Bajo Stock', value: total, color: T.accent, icon: 'package-variant' },
        { label: 'Críticos (0-3)', value: criticos, color: T.red, icon: 'alert-circle' },
        { label: 'Advertencias (4-10)', value: advertencias, color: T.amber, icon: 'alert' },
    ];

    return (
        <View style={{ flexDirection: 'row', gap: 10 }}>
            {stats.map((s, i) => (
                <View
                    key={i}
                    style={{
                        flex: 1,
                        backgroundColor: T.surface,
                        borderRadius: 14,
                        padding: 14,
                        borderWidth: 1,
                        borderColor: T.border,
                        alignItems: 'center',
                    }}
                >
                    <View style={{
                        width: 36, height: 36, borderRadius: 10,
                        backgroundColor: s.color + '18',
                        alignItems: 'center', justifyContent: 'center',
                        marginBottom: 8,
                    }}>
                        <Icon name={s.icon as any} size={18} color={s.color} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: T.textPrimary }}>{s.value}</Text>
                    <Text style={{ fontSize: 10, color: T.textMuted, textAlign: 'center', marginTop: 2 }}>{s.label}</Text>
                </View>
            ))}
        </View>
    );
}
