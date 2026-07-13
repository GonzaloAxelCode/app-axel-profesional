import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from "@/State/context/ThemeContext";

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
    const { T } = useAppTheme();
    return (
        <View style={s(T).sectionHeader}>
            <Text style={s(T).sectionTitle}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={onAction} style={s(T).seeAllBtn}>
                    <Text style={s(T).sectionAction}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const s = (T: any) => StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: T.textPrimary, letterSpacing: -0.3 },
    seeAllBtn: {
        backgroundColor: T.surface, borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 5,
        borderWidth: 1, borderColor: T.border,
    },
    sectionAction: { fontSize: 11, color: T.accent, fontWeight: '600' },
});

export default SectionHeader;
