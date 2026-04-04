import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import ClientesScreen from './clientes';
import ConfiguracionScreen from './configuracion';
import InicioScreen from './inicio';
import { ProductosScreen } from './productos';
import VentasScreen from './ventas';

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'inicio', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'productos', title: 'Productos', focusedIcon: 'cube-outline', unfocusedIcon: 'cube' },


    {
      key: 'ventas',
      title: '', // Tab oculto
      focusedIcon: () => <View style={{ width: 0, height: 0 }} />,
      unfocusedIcon: () => <View style={{ width: 0, height: 0 }} />,
    },

    { key: 'clientes', title: 'Clientes', focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline' },
    { key: 'configuracion', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    inicio: () => (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <InicioScreen />
      </Animated.View>
    ),
    productos: () => (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <ProductosScreen />
      </Animated.View>
    ),
    ventas: () => (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <VentasScreen />
      </Animated.View>
    ),
    clientes: () => (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <ClientesScreen />
      </Animated.View>
    ),
    configuracion: () => (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <ConfiguracionScreen />
      </Animated.View>
    ),

  });

  return (
    <View style={{ flex: 1 }}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        style={{ paddingBottom: 10, backgroundColor: theme.colors.background }}
        renderScene={renderScene}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.onSurfaceVariant}
        barStyle={{ backgroundColor: theme.colors.surface, height: 60 }}
      />

      {/* FAB central */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIndex(2)} // Cambia al tab de ventas
      >
        <Icon name="cart" size={30} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#000',
    width: 64,

    height: 64,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  hiddenIcon: {
    height: 0, width: 0,
  }
});