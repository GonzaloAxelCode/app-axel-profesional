import { useAppTheme } from '@/State/context/ThemeContext';
import { useDailySummary } from '@/State/hooks/useDailySummary';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

import DailyMetricsCards from '@/components/InicioComponents/DailyMetricsCards';
import DailyPaymentMethods from '@/components/InicioComponents/DailyPaymentMethods';
import DailyPeakHours from '@/components/InicioComponents/DailyPeakHours';
import DailyTopProducts from '@/components/InicioComponents/DailyTopProducts';
import DailyTopCategories from '@/components/InicioComponents/DailyTopCategories';
import DailyRecentSales from '@/components/InicioComponents/DailyRecentSales';
import DailyCustomers from '@/components/InicioComponents/DailyCustomers';

export default function ResumenDiaTab() {
    const { T } = useAppTheme();
    const {
        summary,
        paymentMethods,
        peakHours,
        topProducts,
        topCategories,
        recentSales,
        customers,
        loadingSummary,
        loadingPaymentMethods,
        loadingPeakHours,
        loadingTopProducts,
        loadingTopCategories,
        loadingRecentSales,
        loadingCustomers,
    } = useDailySummary();

    const isLoading = loadingSummary || loadingPaymentMethods || loadingPeakHours ||
        loadingTopProducts || loadingTopCategories || loadingRecentSales || loadingCustomers;

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60, gap: 12 }}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Cargando resumen del día...</Text>
            </View>
        );
    }

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 16 }}>
            {/* Métricas principales */}
            <DailyMetricsCards summary={summary} />

            {/* Métodos de pago */}
            <DailyPaymentMethods data={paymentMethods} />

            {/* Hora pico */}
            <DailyPeakHours data={peakHours} />

            {/* Ventas por categoría */}
            <DailyTopCategories data={topCategories} />

            {/* Top 10 productos */}
            <DailyTopProducts data={topProducts} />

            {/* Últimas ventas */}
            <DailyRecentSales data={recentSales} />

            {/* Clientes nuevos vs recurrentes */}
            <DailyCustomers data={customers} />
        </View>
    );
}
