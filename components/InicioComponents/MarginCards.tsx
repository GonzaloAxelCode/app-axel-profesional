import { useAppTheme } from '@/State/context/ThemeContext';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function MarginCards() {
    const { T } = useAppTheme();

    // Datos hardcodeados (igual que la web)
    const data = {
        ingresos: 32100,
        costoProductos: 18500,
        gananciaBruta: 13600,
        margenPorcentaje: 42.4,
    };

    const cards = [
        { label: 'Ingresos Totales', value: `S/ ${data.ingresos.toLocaleString()}`, color: T.green },
        { label: 'Costo de Productos', value: `S/ ${data.costoProductos.toLocaleString()}`, color: T.red },
        { label: 'Ganancia Bruta', value: `S/ ${data.gananciaBruta.toLocaleString()}`, color: T.accent },
        { label: 'Margen', value: `${data.margenPorcentaje}%`, color: T.blue },
    ];

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {cards.map((c, i) => (
                <View
                    key={i}
                    style={{
                        width: '48%',
                        backgroundColor: T.surface,
                        borderRadius: 14,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: T.border,
                    }}
                >
                    <Text style={{ fontSize: 11, color: T.textMuted, marginBottom: 8 }}>{c.label}</Text>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: c.color }}>{c.value}</Text>
                </View>
            ))}
        </View>
    );
}
