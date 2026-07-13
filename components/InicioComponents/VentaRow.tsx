import { useAppTheme } from "@/State/context/ThemeContext";
import { Venta } from '@/State/models/venta.models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const VentaRow = ({ venta }: { venta: Venta }) => {
    const { T } = useAppTheme();
    const st = styles(T);
    const cliente = venta.nombre_cliente || 'Cliente anónimo';
    const inicial = cliente.charAt(0).toUpperCase();
    const total = typeof venta.total === 'number' ? venta.total : 0;
    const metodo = venta.metodo_pago || '';
    const estado = venta.estado || '';

    return (
        <View style={st.row}>
            <View style={st.avatar}>
                <Text style={st.avatarText}>{inicial}</Text>
            </View>
            <View style={st.info}>
                <Text style={st.name}>{cliente}</Text>
                <Text style={st.sub}>{metodo} · {estado}</Text>
            </View>
            <Text style={st.amount}>S/ {total.toFixed(2)}</Text>
        </View>
    );
};

const styles = (T: any) => StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    avatar: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: T.accentDim, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: T.accent + '30',
    },
    avatarText: { fontSize: 14, fontWeight: '800', color: T.accent },
    info: { flex: 1 },
    name: { fontSize: 13, fontWeight: '600', color: T.textPrimary },
    sub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
    amount: { fontSize: 14, fontWeight: '700', color: T.textPrimary },
});

export default VentaRow;
