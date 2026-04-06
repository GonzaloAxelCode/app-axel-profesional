import { useVentas } from '@/State/hooks/useVentas';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const VentasUltimos30DiasChart = () => {
    const hoy = new Date();
    const { ventasPorRangoFechasTienda } = useVentas();
    //const ventas = ventasPorRangoFechasTienda 
    const ventas: any = []
    // aca tenemos que ajustar el formato para luego 

    const dias30 = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - (29 - i)); // 29 para incluir hoy
        return d;
    });

    // Agrupar ventas por día
    const ventasPorDia = dias30.map(dia => {
        const totalDia = ventas
            ? ventas
                .filter((v: any) => {
                    const fecha = new Date(v.fecha_realizacion);
                    return (
                        fecha.getFullYear() === dia.getFullYear() &&
                        fecha.getMonth() === dia.getMonth() &&
                        fecha.getDate() === dia.getDate()
                    );
                })
                .reduce((acc: any, v: any) => acc + v.comprobante.total, 0)
            : 0;

        return {
            date: dia.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' }),
            total: totalDia,
        };
    });

    const labels = ventasPorDia.map(v => v.date);
    const values = ventasPorDia.map(v => v.total);

    return (
        <ScrollView horizontal>
            <BarChart
                data={{
                    labels,
                    datasets: [{ data: values }],
                }}
                width={Math.max(labels.length * 50, screenWidth)}
                height={220}
                yAxisLabel="S/."
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
                fromZero
                showValuesOnTopOfBars
            />
        </ScrollView>
    );
};

export default VentasUltimos30DiasChart;