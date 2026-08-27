import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { useDashboardVentas } from '@/State/hooks/useDashboardVentas';
import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

import SalesCards from '@/components/InicioComponents/SalesCards';
import TopProductsChart from '@/components/InicioComponents/TopProductsChart';
import TopCategoriesChart from '@/components/InicioComponents/TopCategoriesChart';
import PaymentMethodsChart from '@/components/InicioComponents/PaymentMethodsChart';
import DailyTrendChart from '@/components/InicioComponents/DailyTrendChart';

const fmt = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function GeneralTab() {
    const { T } = useAppTheme();

    // Selectores para cards
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Selectores para métodos de pago y categorías (independientes)
    const [payMonth, setPayMonth] = useState(new Date().getMonth());
    const [payYear, setPayYear] = useState(new Date().getFullYear());

    // Hook para cards
    const {
        ventasDia,
        ventasMes,
        resumenGeneral,
        loadingDia,
        loadingMes,
        loadingGeneral,
    } = useDashboardVentas({ selectedDate, selectedMonth, selectedYear });

    // Hook para métodos de pago y categorías
    const {
        metodosPago,
        topCategorias,
        loadingMetodosPago,
        loadingTopCategorias,
    } = useDashboardVentas({ selectedMonth: payMonth, selectedYear: payYear });

    // Hook para los demás componentes (mes actual)
    const {
        topProductosMonth,
        dailyTrend,
        loadingTopProductosMonth,
        loadingDailyTrend,
    } = useVentas();

    const loadingCards = loadingDia || loadingMes || loadingGeneral;
    const loadingCharts = loadingTopProductosMonth || loadingMetodosPago || loadingTopCategorias || loadingDailyTrend;

    if (loadingCards || loadingCharts) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60, gap: 12 }}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Cargando estadísticas...</Text>
            </View>
        );
    }

    // Cards
    const hoy = ventasDia?.todaySales ?? 0;
    const semana = resumenGeneral?.thisWeekSales ?? 0;
    const mes = ventasMes?.thisMonthSales ?? 0;

    // Top productos (mes actual)
    const topProducts = (topProductosMonth?.results ?? []).map((p: any) => ({
        nombre: p.nombre ?? 'Sin nombre',
        cantidad: p.cantidad_total_vendida ?? 0,
        total: 0,
    }));

    // Top categorías (con selectores propios)
    console.log('topCategorias raw:', topCategorias);
    const topCategories = (topCategorias?.categorias ?? []).map((c: any) => ({
        nombre: c.nombre ?? 'Sin nombre',
        total_unidades: c.total_unidades ?? 0,
        total_ingresos: c.total_ingresos ?? 0,
    }));
    console.log('topCategories mapped:', topCategories);

    // Métodos de pago (con selectores propios)
    const methods = (metodosPago?.metodos_pago ?? []).map((m: any) => ({
        metodo: m.metodo_pago ?? 'Otro',
        cantidad: m.cantidad ?? 0,
        total: m.total ?? 0,
    }));

    // Tendencia diaria (últimos 20 días)
    const trend = (dailyTrend?.results ?? []).map((d: any) => ({
        fecha: d.fecha ?? '',
        total: d.total ?? 0,
    }));

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 16 }}>
            {/* Cards - Afectados por selectores de fecha */}
            <SalesCards
                hoy={fmt(hoy)}
                semana={fmt(semana)}
                mes={fmt(mes)}
                selectedDate={selectedDate}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onDateChange={setSelectedDate}
                onMonthChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }}
            />

            {/* Top productos - Siempre mes actual */}
            <TopProductsChart products={topProducts} />

            {/* Top categorías - Selectores independientes */}
            <TopCategoriesChart
                categories={topCategories}
                selectedMonth={payMonth}
                selectedYear={payYear}
                onMonthChange={(m, y) => { setPayMonth(m); setPayYear(y); }}
                loading={loadingTopCategorias}
            />

            {/* Métodos de pago - Selectores independientes */}
            <PaymentMethodsChart
                methods={methods}
                selectedMonth={payMonth}
                selectedYear={payYear}
                onMonthChange={(m, y) => { setPayMonth(m); setPayYear(y); }}
            />

            {/* Tendencia diaria - Siempre últimos 20 días */}
            <DailyTrendChart data={trend} />
        </View>
    );
}
