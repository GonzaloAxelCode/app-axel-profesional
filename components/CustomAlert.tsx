import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface CustomAlertProps {
    visible: boolean;
    type?: AlertType;
    title: string;
    message?: string;
    onClose: () => void;
    confirmText?: string;
}

const ALERT_CONFIG: Record<AlertType, { icon: string; color: string }> = {
    error: { icon: 'alert-circle', color: '#FF5A5A' },
    success: { icon: 'check-circle', color: '#4CAF50' },
    warning: { icon: 'alert', color: '#FFB020' },
    info: { icon: 'information', color: '#3BA7FF' },
};

export default function CustomAlert({ visible, type = 'error', title, message, onClose, confirmText = 'Entendido' }: CustomAlertProps) {
    const { T } = useAppTheme();
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const config = ALERT_CONFIG[type];

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 65, friction: 9 }),
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            scale.setValue(0.8);
            opacity.setValue(0);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, { backgroundColor: T.surface, transform: [{ scale }], opacity }]}>
                    {/* Icon */}
                    <View style={[styles.iconWrap, { backgroundColor: config.color + '18' }]}>
                        <Icon name={config.icon as any} size={32} color={config.color} />
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: T.textPrimary }]}>{title}</Text>

                    {/* Message */}
                    {message && (
                        <Text style={[styles.message, { color: T.textSecondary }]}>{message}</Text>
                    )}

                    {/* Button */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: config.color }]}
                        onPress={onClose}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>{confirmText}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        gap: 16,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    message: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});
