import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const CLIENTES = [
    { id: 1, nombre: 'María García', tiktok: '@mariagarcia', compras: 5, totalGastado: 8500, ultimaCompra: '19/08/2026', distrito: 'Miraflores', telefono: '999123456' },
    { id: 2, nombre: 'Juan Pérez', tiktok: '@juanperez', compras: 3, totalGastado: 4200, ultimaCompra: '19/08/2026', distrito: 'San Isidro', telefono: '987654321' },
    { id: 3, nombre: 'Ana López', tiktok: '@analopez', compras: 8, totalGastado: 1200, ultimaCompra: '18/08/2026', distrito: 'Surco', telefono: '976543210' },
    { id: 4, nombre: 'Carlos Ruiz', tiktok: '@carlosruiz', compras: 2, totalGastado: 2100, ultimaCompra: '18/08/2026', distrito: 'La Molina', telefono: '965432109' },
    { id: 5, nombre: 'Laura Torres', tiktok: '@latorres', compras: 6, totalGastado: 5800, ultimaCompra: '17/08/2026', distrito: 'Barranco', telefono: '954321098' },
];

const AVATAR_COLORS = ['#C6FF00', '#6DFF7A', '#3BA7FF', '#FFB020', '#9B6DFF'];

export default function TikTokClientes() {
    const { T } = useAppTheme();

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Mis Clientes TikTok</Text>

            {CLIENTES.map((c, i) => {
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                    <View
                        key={i}
                        style={{
                            backgroundColor: T.surface,
                            borderRadius: 16,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: T.border,
                        }}
                    >
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                            <View style={{
                                width: 48, height: 48, borderRadius: 14,
                                backgroundColor: color + '22',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '900', color }}>{c.nombre.charAt(0)}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>{c.nombre}</Text>
                                <Text style={{ fontSize: 12, color: T.accent }}>{c.tiktok}</Text>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>{c.distrito} · {c.telefono}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>Compras</Text>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary }}>{c.compras}</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>Total Gastado</Text>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: T.green }}>S/ {c.totalGastado.toLocaleString()}</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 10, color: T.textMuted }}>Última</Text>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: T.textPrimary }}>{c.ultimaCompra}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
