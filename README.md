# App Inventario 📦

Aplicación multiplataforma para gestión de inventarios desarrollada con React Native y Expo.

## Características Principales

- Gestión de productos e inventario
- Impresión de reportes y etiquetas
- Escaneo de códigos (Bluetooth)
- Visualización de gráficos y estadísticas
- Interfaz intuitiva con Material Design
- Soporte multiplataforma (Android, iOS, Web)

## Stack Tecnológico

### Framework
- **React Native** 0.81.5
- **Expo** SDK 54
- **React** 19.1.0
- **TypeScript** 5.9

### Navegación
- **expo-router** 6 - Enrutamiento basado en archivos
- **@react-navigation** - Navegación por pestañas

### Estado y Datos
- **zustand** 5 - Estado global
- **@tanstack/react-query** 5 - Estado del servidor
- **axios** - Cliente HTTP

### UI y Estilos
- **NativeWind** 4 + **Tailwind CSS** 3.4 - Utilidades CSS
- **react-native-paper** 5 - Componentes Material Design
- **@expo/vector-icons** - Iconos

### Funcionalidades Especiales
- **react-native-gesture-handler** - Gestos
- **react-native-reanimated** - Animaciones
- **expo-print** - Impresión
- **expo-file-system** - Sistema de archivos
- **react-native-chart-kit** - Gráficos
- **@gorhom/bottom-sheet** - Sheets modales

### Herramientas de Desarrollo
- **ESLint** - Linting
- **Prettier** - Formateo de código

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Para Android: Android Studio
- Para iOS: Xcode (solo macOS)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd app-inventario
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npx expo start
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Iniciar servidor de Expo |
| `npm run android` | Ejecutar en Android |
| `npm run ios` | Ejecutar en iOS |
| `npm run web` | Ejecutar en navegador |
| `npm run lint` | Verificar código |
| `npm run reset-project` | Reiniciar proyecto |

## Estructura del Proyecto

```
app-inventario/
├── app/                    # Pantallas (Expo Router)
├── components/             # Componentes reutilizables
├── constants/              # Constantes y configuración
├── State/                  # Estado global (Zustand)
├── utils/                  # Utilidades y helpers
├── assets/                 # Recursos estáticos
├── scripts/                # Scripts de configuración
└── android/                # Configuración Android
```

## Plataformas Soportadas

- **Android** (API 21+)
- **iOS** (iOS 13+)
- **Web** (Navegadores modernos)

## Permisos Android

La aplicación requiere los siguientes permisos:
- `BLUETOOTH` - Conexión Bluetooth
- `BLUETOOTH_ADMIN` - Administración Bluetooth
- `BLUETOOTH_CONNECT` - Conexión a dispositivos
- `BLUETOOTH_SCAN` - Escaneo de dispositivos

## Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)

## Características Adicionales

- **Sistema de Punto de Venta (POS):** Proceso completo de ventas con carrito, múltiples métodos de pago (Efectivo, PLIN, YAPE), tipos de comprobante (Boleta, Factura, Anónima), descuentos por ítem, cálculo de IGV y consulta de cliente por DNI/RUC.
- **Gestión de Clientes (CRM):** CRUD de clientes con búsqueda, validación de DNI/RUC mediante API externa, y UI animada con tarjetas.
- **Integración con SUNAT:** Generación de comprobantes electrónicos (Boletas y Facturas) con numeración series/correlativo, envío a SUNAT, seguimiento de estado, y emisión de Notas de Crédito para anulaciones.

## Licencia

MIT