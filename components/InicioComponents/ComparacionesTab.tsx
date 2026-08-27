import { useAppTheme } from '@/State/context/ThemeContext';
import { useVentas } from '@/State/hooks/useVentas';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

import PerformanceGauge from '@/components/InicioComponents/PerformanceGauge';

export default function ComparacionesTab() {
    const { T } = useAppTheme();
    const { satisfaccion, loadingSatisfaccion } = useVentas();

    if (loadingSatisfaccion) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60, gap: 12 }}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={{ fontSize: 14, color: T.textSecondary }}>Cargando comparaciones...</Text>
            </View>
        );
    }

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 16 }}>
            <PerformanceGauge data={satisfaccion} />
        </View>
    );
}
