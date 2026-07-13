import { useAppTheme } from "@/State/context/ThemeContext";
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatPill = memo(({ label, value }: { label: string; value: string }) => {
    const { T } = useAppTheme();
    return (
        <View style={s(T).statPill}>
            <Text style={s(T).statPillVal}>{value}</Text>
            <Text style={s(T).statPillLbl}>{label}</Text>
        </View>
    );
});

StatPill.displayName = "StatPill";
export default StatPill;

const s = (T: any) => StyleSheet.create({
    statPill: { flex: 1, alignItems: 'center', gap: 4 },
    statPillVal: { fontSize: 25, fontWeight: '900', color: T.textPrimary },
    statPillLbl: { fontSize: 15, color: T.textSecondary, fontWeight: '500' },
});
