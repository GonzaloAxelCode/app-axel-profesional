import { useAppTheme } from '@/State/context/ThemeContext';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

export type PayMethod = 'Efectivo' | 'PLIN' | 'YAPE';

const PAY_OPTIONS: {
  key: PayMethod;
  label: string;
  icon: string;
  description: string;
}[] = [
    {
      key: 'Efectivo',
      label: 'Efectivo',
      icon: 'cash',
      description: 'Pago en físico al momento.',
    },
    {
      key: 'PLIN',
      label: 'PLIN',
      icon: 'cellphone',
      description: 'Transferencia vía PLIN.',
    },
    {
      key: 'YAPE',
      label: 'YAPE',
      icon: 'qrcode-scan',
      description: 'Escanea tu QR de Yape.',
    },
  ];

interface PagoCardProps {
  payMethod: PayMethod;
  onSelect: (method: PayMethod) => void;
}

export function PagoCard({ payMethod, onSelect }: PagoCardProps) {
  const { T } = useAppTheme();
  const [fotoComprobante, setFotoComprobante] = useState<string | null>(null);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoComprobante(result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    setFotoComprobante(null);
  };

  const showCameraOption = payMethod === 'YAPE' || payMethod === 'PLIN';

  const makeStyles = (T: any) => StyleSheet.create({
    wrapper: {
      gap: 10,
      backgroundColor: T.surfaceAlt,
      borderRadius: T.radiusLg,
      padding: 14,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: T.textMuted,
      paddingHorizontal: 2,
    },
    list: {
      flexDirection: 'row',
      gap: 8,
    },
    card: {
      flex: 1,
      position: 'relative',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      backgroundColor: T.surface,
      borderRadius: T.radiusMd,
      borderWidth: 1.5,
      borderColor: T.border,
      padding: 14,
    },
    cardActive: {
      borderColor: T.accent,
      backgroundColor: T.accentDim,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: T.radiusMd,
      backgroundColor: T.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBoxActive: {
      backgroundColor: T.accent,
    },
    textBox: {
      alignItems: 'center',
      gap: 2,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: T.textPrimary,
      textAlign: 'center',
    },
    labelActive: {
      color: T.textPrimary,
    },
    description: {
      fontSize: 10,
      color: T.textMuted,
      lineHeight: 14,
      textAlign: 'center',
    },
    check: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: T.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraSection: {
      backgroundColor: T.surface,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: T.border,
    },
    cameraHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    cameraBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: T.surfaceAlt,
      borderRadius: 12,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: T.border,
      borderStyle: 'dashed',
    },
    photoPreview: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: T.border,
    },
    photo: {
      width: '100%',
      height: 200,
      borderRadius: 12,
    },
    removeBtn: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  const styles = makeStyles(T);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Método de pago</Text>

      <View style={styles.list}>
        {PAY_OPTIONS.map((opt) => {
          const isActive = payMethod === opt.key;

          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => onSelect(opt.key)}
              activeOpacity={0.85}
            >
              {/* CHECK esquina */}
              {isActive && (
                <View style={styles.check}>
                  <Icon source="check" size={12} color="#0A0A0A" />
                </View>
              )}

              {/* ICONO */}
              <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                <Icon
                  source={opt.icon as any}
                  size={22}
                  color={isActive ? '#0A0A0A' : T.textMuted}
                />
              </View>

              {/* TEXTO */}
              <View style={styles.textBox}>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.description}>{opt.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sección de cámara para YAPE/PLIN */}
      {showCameraOption && (
        <View style={styles.cameraSection}>
          <View style={styles.cameraHeader}>
            <Icon source="camera-outline" size={18} color={T.textMuted} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: T.textSecondary }}>
              Captura de comprobante {payMethod}
            </Text>
          </View>

          {fotoComprobante ? (
            <View style={styles.photoPreview}>
              <Image
                source={{ uri: fotoComprobante }}
                style={styles.photo}
                contentFit="cover"
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={removePhoto}
              >
                <Icon source="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={openCamera}
              activeOpacity={0.8}
            >
              <Icon source="camera" size={22} color={T.textMuted} />
              <Text style={{ fontSize: 13, color: T.textMuted, fontWeight: '500' }}>
                Abrir cámara
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
