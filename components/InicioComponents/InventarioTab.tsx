import { useAppTheme } from '@/State/context/ThemeContext';
import { useLowStock } from '@/State/hooks/useLowStock';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

import LowStockStats from '@/components/InicioComponents/LowStockStats';
import LowStockTable from '@/components/InicioComponents/LowStockTable';
import LowStockByCategory from '@/components/InicioComponents/LowStockByCategory';

export default function InventarioTab() {
    const { T } = useAppTheme();
    const { lowStockProducts, loading } = useLowStock();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60, gap: 12 }}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Cargando inventario...</Text>
            </View>
        );
    }

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 16 }}>
            {/* Stats */}
            <LowStockStats products={lowStockProducts} />

            {/* Tabla */}
            <LowStockTable products={lowStockProducts} />

            {/* Por categoría */}
            <LowStockByCategory products={lowStockProducts} />
        </View>
    );
}
