import { useAppTheme } from "@/State/context/ThemeContext";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    icon: string;
    label: string;
    time: string;
    onPress: () => void;
}

const ServiceChip = ({ icon, label, time, onPress }: Props) => {
    const { T } = useAppTheme();
    const st = styles(T);
    return (
        <TouchableOpacity style={st.chip} onPress={onPress} activeOpacity={0.8}>
            <View style={st.iconWrap}>
                <Icon name={icon as any} size={18} color={T.accent} />
            </View>
            <View>
                <Text style={st.time}>{time}</Text>
                <Text style={st.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = (T: any) => StyleSheet.create({
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: T.surface, borderRadius: 16,
        borderWidth: 1, borderColor: T.border,
        paddingHorizontal: 14, paddingVertical: 12,
    },
    iconWrap: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: T.accentDim, borderWidth: 1, borderColor: T.accent + '30',
        alignItems: 'center', justifyContent: 'center',
    },
    time: { fontSize: 9, color: T.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    label: { fontSize: 13, fontWeight: '600', color: T.textPrimary, marginTop: 1 },
});

export default ServiceChip;
