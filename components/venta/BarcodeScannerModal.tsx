import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onScan: (sku: string) => void;
  productos: any[];
}

export default function BarcodeScannerModal({ visible, onClose, onScan, productos }: Props) {
  const { T } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scannedRef = useRef(false);

  const showError = (message: string) => {
    setError(message);
    Animated.timing(errorOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => {
      Animated.timing(errorOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setError(null));
    }, 3000);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scannedRef.current || loading) return;
    scannedRef.current = true;
    setLoading(true);
    setError(null);

    // Verificar si el producto existe
    const producto = productos?.find((p) => p.producto_sku?.toLowerCase() === data.toLowerCase());
    
    if (producto) {
      // Devolver el SKU escaneado
      onScan(data);
      
      // Cerrar el modal después de un breve delay
      setTimeout(() => {
        onClose();
        scannedRef.current = false;
        setLoading(false);
      }, 300);
    } else {
      // Mostrar error en el modal
      showError(`No se encontró producto con SKU: ${data}`);
      setLoading(false);
      // Permitir escanear de nuevo después de un breve delay
      setTimeout(() => {
        scannedRef.current = false;
      }, 2000);
    }
  };

  useEffect(() => {
    if (visible) {
      scannedRef.current = false;
      setLoading(false);
      setError(null);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  if (!visible) return null;

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: T.bg }]}>
          <ActivityIndicator size="large" color={T.accent} />
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: T.bg, justifyContent: 'center', alignItems: 'center', gap: 20 }]}>
          <Icon name="camera-off-outline" size={60} color={T.textMuted} />
          <Text style={{ color: T.textPrimary, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
            Se necesita permiso de cámara
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={[styles.button, { backgroundColor: T.accent }]}
          >
            <Text style={[styles.buttonText, { color: T.bg }]}>Conceder permiso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border }]}
          >
            <Text style={[styles.buttonText, { color: T.textPrimary }]}>Volver</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={loading ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['code128', 'code39', 'ean13', 'ean8', 'upc_a', 'upc_e'],
          }}
        />

        {/* Error Toast */}
        {error && (
          <Animated.View style={[styles.errorToast, { opacity: errorOpacity }]}>
            <Icon name="alert-circle-outline" size={20} color="#fff" />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: T.surface + 'EE' }]}
            >
              <Icon name="close" size={24} color={T.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: '#fff' }]}>Escanear código de barras</Text>
          </View>

          <View style={styles.middleOverlay}>
            <View style={styles.leftOverlay} />
            <View style={[styles.scanFrame, { borderColor: T.accent }]}>
              <View style={[styles.corner, styles.topLeft, { borderColor: T.accent }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: T.accent }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: T.accent }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: T.accent }]} />
              {loading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={T.accent} />
                  <Text style={[styles.loadingText, { color: '#fff' }]}>Procesando...</Text>
                </View>
              )}
            </View>
            <View style={styles.rightOverlay} />
          </View>

          <View style={styles.bottomOverlay}>
            <Text style={[styles.instruction, { color: '#fff' }]}>
              Apunta la cámara al código de barras del producto
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  middleOverlay: {
    flexDirection: 'row',
    height: 200,
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  scanFrame: {
    width: 250,
    height: 200,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  instruction: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorToast: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
