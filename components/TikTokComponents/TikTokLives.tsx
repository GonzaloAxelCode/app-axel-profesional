import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import TikTokLiveModal from './TikTokLiveModal';

const LIVES = [
    { id: 1, titulo: 'Live #1', fecha: '19/08/2026', hora: '10:00 AM', duracion: '2h 15m', estado: 'finalizado', ventas: 24, ingresos: 1850 },
    { id: 2, titulo: 'Live #2', fecha: '18/08/2026', hora: '3:00 PM', duracion: '1h 45m', estado: 'finalizado', ventas: 18, ingresos: 1420 },
    { id: 3, titulo: 'Live #3', fecha: '17/08/2026', hora: '11:00 AM', duracion: '3h 00m', estado: 'finalizado', ventas: 42, ingresos: 3200 },
    { id: 4, titulo: 'Live Ofertas', fecha: '16/08/2026', hora: '6:00 PM', duracion: '2h 30m', estado: 'finalizado', ventas: 35, ingresos: 2800 },
];

export default function TikTokLives() {
    const { T } = useAppTheme();
    const [selectedLive, setSelectedLive] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openLive = (live: any) => {
        setSelectedLive(live);
        setModalVisible(true);
    };

    const closeLive = () => {
        setModalVisible(false);
        setSelectedLive(null);
    };

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.textPrimary, marginBottom: 4 }}>Lives Realizados</Text>

            {LIVES.map((live, i) => (
                <TouchableOpacity
                    key={i}
                    onPress={() => openLive(live)}
                    activeOpacity={0.85}
                    style={{
                        backgroundColor: T.surface,
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: T.border,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={{
                                width: 40, height: 40, borderRadius: 12,
                                backgroundColor: live.estado === 'en_vivo' ? '#FF0000' + '18' : T.accent + '18',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon
                                    name={live.estado === 'en_vivo' ? 'video' : 'video-outline'}
                                    size={20}
                                    color={live.estado === 'en_vivo' ? '#FF0000' : T.accent}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: T.textPrimary }}>{live.titulo}</Text>
                                <Text style={{ fontSize: 11, color: T.textMuted }}>{live.fecha} · {live.hora}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {live.estado === 'en_vivo' && (
                                <View style={{ backgroundColor: '#FF0000' + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#FF0000' }}>EN VIVO</Text>
                                </View>
                            )}
                            <Icon name="chevron-right" size={20} color={T.textMuted} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: T.textMuted }}>Duración</Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: T.textPrimary }}>{live.duracion}</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: T.textMuted }}>Ventas</Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: T.accent }}>{live.ventas}</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: T.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: T.textMuted }}>Ingresos</Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: T.green }}>S/ {live.ingresos}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <TikTokLiveModal
                visible={modalVisible}
                live={selectedLive}
                onClose={closeLive}
            />
        </View>
    );
}
