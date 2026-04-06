import VentasChart from '@/components/venta/VentasChart';
import { useVentas } from '@/State/hooks/useVentas';
import { Venta } from '@/State/models/venta.models';
import { useVentaStore } from '@/State/store/useVentaStore';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useEffect, useMemo } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: W } = Dimensions.get('window');

// ─── Utils ────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  `S/. ${n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const formatHour = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

const today = new Date().toLocaleDateString('es-PE', {
  weekday: 'long', day: 'numeric', month: 'long',
});

// ─── Mini stat card ───────────────────────────────────────────────────────────
const BAR_MAX_H = 72;
const MiniStat = memo(({ label, value }: { label: string; value: string }) => (
  <View style={styles.miniStat}>
    <Text style={styles.miniStatVal}>{value}</Text>
    <Text style={styles.miniStatLbl}>{label}</Text>
  </View>
));
MiniStat.displayName = 'MiniStat';


const TopProductRow = memo(({ nombre, cantidad, total, rank, maxCantidad }: {
  nombre: string; cantidad: number; total: number; rank: number; maxCantidad: number;
}) => {
  const pct = maxCantidad > 0 ? cantidad / maxCantidad : 0;
  return (
    <View style={styles.listRow}>
      <View style={[styles.rankBadge, rank === 1 ? styles.rankBadge1 : styles.rankBadgeN]}>
        <Text style={[styles.rankText, rank === 1 && styles.rankText1]}>{rank}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.listName} numberOfLines={1}>{nombre}</Text>
        <Text style={styles.listSub}>{cantidad} uds vendidas</Text>
        <View style={styles.prog}>
          <View style={[styles.progFill, { width: `${pct * 100}%` as any }]} />
        </View>
      </View>
      <Text style={styles.listAmt}>{fmt(total)}</Text>
    </View>
  );
});
TopProductRow.displayName = 'TopProductRow';
// ─── Venta row ────────────────────────────────────────────────────────────────

const VentaRow = memo(({ venta }: { venta: Venta }) => {
  VentaRow.displayName = 'VentaRow';
  const isActive = venta.estado === 'Activo';
  const cliente = venta.nombre_cliente || 'Cliente anónimo';
  const initials = getInitials(cliente);
  const isCorp = initials.length > 2;
  return (
    <View style={styles.listRow}>
      <View style={[styles.avatarCircle, isCorp && styles.avatarCircleDark]}>
        <Text style={[styles.avatarText, isCorp && styles.avatarTextDark]}>
          {initials.slice(0, 3)}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.listName} numberOfLines={1}>{cliente}</Text>
        <Text style={styles.listSub}>
          {venta.tipo_comprobante} · {venta.metodo_pago} · {formatHour(venta.fecha_hora)}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.listAmt}>{fmt(venta.total)}</Text>
        <View style={[styles.chip, !isActive ? styles.chipOk : styles.chipErr]}>
          <Text style={[styles.chipText, { color: !isActive ? '#3a7d00' : '#cc0000' }]}>
            {venta.estado}
          </Text>
        </View>
      </View>
    </View>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────


export default function InicioScreen() {
  const router = useRouter();

  const { resumenVentas, ventasHoy, topProductosHoy } = useVentas();
  const { loadVentasRangoFechas } = useVentaStore();

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    loadVentasRangoFechas(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0],
    );
  }, []);

  // Stats
  const todaySales = resumenVentas?.todaySales ?? 0;
  const weekSales = resumenVentas?.thisWeekSales ?? 0;
  const monthSales = resumenVentas?.thisMonthSales ?? 0;
  const totalHoy = ventasHoy?.length ?? 0;


  // Top productos
  const maxCantidad = useMemo(
    () => Math.max(...(topProductosHoy?.map((p) => p.cantidad_total_vendida) ?? [1])),
    [topProductosHoy],
  );

  const ventasDeHoy = ventasHoy?.slice(0, 8) ?? [];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting} numberOfLines={1}>{today}</Text>
          <Text style={styles.storeName}>Axel Accesories </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push('/configuracion')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarBtnText}>MT</Text>
        </TouchableOpacity>
      </View>

      {/* Summary card — dark */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLabelRow}>
          <View style={styles.summaryDot} />
          <Text style={styles.summaryLabel}>Ventas de Hoy</Text>
        </View>
        <Text style={styles.summaryValue}>{fmt(todaySales)}</Text>
        <Text style={styles.summarySub}>Actualizado ahora</Text>

        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <MiniStat label="Hoy" value={fmt(todaySales)} />
          <View style={styles.summaryRowDivider} />
          <MiniStat label="Semana" value={fmt(weekSales)} />
          <View style={styles.summaryRowDivider} />
          <MiniStat label="Mes" value={fmt(monthSales)} />
        </View>
      </View>

      {/* Chart section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <TouchableOpacity>

        </TouchableOpacity>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartTop}>
          <View>
            <Text style={styles.chartLabel}>Ventas últimos 30 días</Text>

          </View>
          <View style={styles.chartBadge}>
            <Text style={styles.chartBadgeText}>+2.2% con respecto al mes anterior</Text>
          </View>
        </View>

        {/* graficos lineas  */}

        <VentasChart />

      </View>

      {/* Top productos */}
      {(topProductosHoy?.length ?? 0) > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top productos</Text>
            <Text style={styles.sectionLink}>{topProductosHoy!.length} items</Text>
          </View>
          <View style={styles.listCard}>
            {topProductosHoy!.slice(0, 5).map((p, i) => (
              <React.Fragment key={p.producto_id ?? i}>
                <TopProductRow
                  rank={i + 1}
                  nombre={p.producto_nombre ?? p.nombre}
                  cantidad={p.cantidad_total_vendida}
                  total={p.precio_unitario * p.cantidad_total_vendida}
                  maxCantidad={maxCantidad}
                />
                {i < Math.min(topProductosHoy!.length, 5) - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </>
      )}

      {/* Ventas de hoy */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ventas de hoy</Text>
        <TouchableOpacity onPress={() => router.replace('/ventas')}>
          <Text style={styles.sectionLink}>Ver todas las ventas</Text>
        </TouchableOpacity>
      </View>

      {ventasDeHoy.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="receipt-text-outline" size={30} color="#ddd" />
          <Text style={styles.emptyText}>Sin ventas hoy todavía</Text>
        </View>
      ) : (
        <View style={[styles.listCard, { marginBottom: 110 }]}>
          {ventasDeHoy.map((v, i) => (
            <React.Fragment key={v.id}>
              <VentaRow venta={v} />
              {i < ventasDeHoy.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { paddingTop: Platform.OS === 'ios' ? 56 : 24, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 18, paddingTop: 20,
  },
  greeting: { fontSize: 15, color: '#aaa', fontWeight: '500', textTransform: 'capitalize' },
  storeName: { fontSize: 28, fontWeight: '800', color: '#0d0d0d', letterSpacing: -0.5, marginTop: 2 },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0d0d0d', alignItems: 'center', justifyContent: 'center',
  },
  avatarBtnText: { fontSize: 13, fontWeight: '800', color: '#c8f566' },

  // Summary card
  summaryCard: {
    marginHorizontal: 20, backgroundColor: '#0d0d0d',
    borderRadius: 24, padding: 22, marginBottom: 20,
  },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  summaryDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#c8f566' },
  summaryLabel: { fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  summaryValue: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: -1.5, lineHeight: 46 },
  summarySub: { fontSize: 15, color: 'rgba(255,255,255,0.35)', marginTop: 6 },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 16 },
  summaryRow: { flexDirection: 'row' },
  summaryRowDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  miniStat: { flex: 1, alignItems: 'center' },
  miniStatVal: { fontSize: 29, fontWeight: '800', color: '#fff' },
  miniStatLbl: { fontSize: 16, color: 'rgba(255,255,255,0.4)', marginTop: 3 },

  // Section headers
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0d0d0d', letterSpacing: -0.3 },
  sectionLink: { fontSize: 15, color: 'black', fontWeight: '500' },

  // Chart
  chartCard: {
    marginHorizontal: 20, backgroundColor: '#fff',
    borderRadius: 20, padding: 18, marginBottom: 20,
  },
  chartTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  chartLabel: { fontSize: 14, color: 'black', fontWeight: '500', marginBottom: 4 },
  chartValue: { fontSize: 26, fontWeight: '800', color: '#0d0d0d', letterSpacing: -0.8 },
  chartBadge: { backgroundColor: '#edffd6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chartBadgeText: { fontSize: 13, fontWeight: '700', color: '#3a7d00' },
  barsContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    height: BAR_MAX_H + 20, gap: 5,
  },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
  bar: { width: '100%', borderRadius: 6, backgroundColor: '#0d0d0d' },
  barAccent: { backgroundColor: '#c8f566' },
  barLbl: { fontSize: 9, color: '#bbb' },

  // List card
  listCard: {
    marginHorizontal: 20, backgroundColor: '#fff',
    borderRadius: 20, overflow: 'hidden', marginBottom: 20,
  },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  divider: { height: 1, backgroundColor: '#f5f5f5', marginHorizontal: 14 },

  // Rank
  rankBadge: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rankBadge1: { backgroundColor: '#0d0d0d' },
  rankBadgeN: { backgroundColor: '#f0f0f0' },
  rankText: { fontSize: 12, fontWeight: '800', color: '#555' },
  rankText1: { color: '#c8f566' },

  // Prog bar
  prog: { height: 3, backgroundColor: '#f0f0f0', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: '#0d0d0d', borderRadius: 2 },

  // Avatar
  avatarCircle: {
    width: 38, height: 38, borderRadius: 14,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center',
  },
  avatarCircleDark: { backgroundColor: '#0d0d0d' },
  avatarText: { fontSize: 13, fontWeight: '700', color: '#555' },
  avatarTextDark: { color: '#c8f566' },

  // List text
  listName: { fontSize: 13, fontWeight: '700', color: '#0d0d0d' },
  listSub: { fontSize: 11, color: '#bbb', marginTop: 2 },
  listAmt: { fontSize: 14, fontWeight: '800', color: '#0d0d0d' },

  // Chip
  chip: { marginTop: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  chipOk: { backgroundColor: '#edffd6' },
  chipErr: { backgroundColor: '#fff0f0' },
  chipText: { fontSize: 10, fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 50, marginBottom: 110 },
  emptyText: { fontSize: 13, color: '#ccc' },
});

