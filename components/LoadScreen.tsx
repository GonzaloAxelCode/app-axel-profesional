import T from '@/constants/THEME';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface Props {
    text?: string;
}

export default function LoadingScreen({ text = 'Cargando...' }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <ActivityIndicator size="large" color={T.accent} />
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: T.bg,
        justifyContent: 'center',
        alignItems: 'center',
    },

    box: {
        paddingVertical: 24,
        paddingHorizontal: 28,
        borderRadius: T.radiusLg,
        backgroundColor: T.surface,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: T.border,
        ...T.shadowCard,
    },

    text: {
        fontSize: 14,
        color: T.textMuted,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});