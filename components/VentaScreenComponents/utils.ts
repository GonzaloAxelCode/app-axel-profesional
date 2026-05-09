import { Venta } from "@/State/models/venta.models";

import T from "@/constants/THEME";
// ─── (MISMAS HELPERS, NO CAMBIO) ─────────────────────────────────────────────
export const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE', {
        month: 'short', day: 'numeric', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

export const ESTADO_CFG: Record<string, { color: string; bg: string }> = {
    aceptado: { color: T.green, bg: T.green + '18' },
    pendiente: { color: T.amber, bg: T.amber + '18' },
    anulado: { color: T.red, bg: T.red + '18' },
    cancelado: { color: T.textSecondary, bg: T.border },
};
export const getEstado = (e: string) => ESTADO_CFG[e?.toLowerCase()] ?? ESTADO_CFG.cancelado;

export const COMPROBANTE_LABEL: Record<string, string> = {
    '01': 'FACTURA', '03': 'BOLETA', boleta: 'BOLETA', factura: 'FACTURA',
};
export const getTipoLabel = (tipo: string) =>
    COMPROBANTE_LABEL[tipo?.toLowerCase()] ?? tipo?.toUpperCase() ?? '—';

export const getInitial = (n: string) => n?.trim()?.charAt(0)?.toUpperCase() ?? '?';

export const AVATAR_COLORS = [T.accent, T.green, T.blue, '#f9a8d4', T.amber, T.purple];
export const getAvatarColor = (n: string) =>
    AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

export type ListItem =
    | { type: 'divider'; fecha: string; count: number }
    | { type: 'venta'; data: Venta };

export const getFechaKey = (f: string) => f.slice(0, 10);
export const formatDivider = (f: string) =>
    new Date(f).toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

export const buildList = (ventas: Venta[]): ListItem[] => {
    const result: ListItem[] = [];
    let lastKey = '';
    for (const v of ventas) {
        const key = getFechaKey(v.fecha_hora);
        if (key !== lastKey) {
            const count = ventas.filter((x) => getFechaKey(x.fecha_hora) === key).length;
            result.push({ type: 'divider', fecha: v.fecha_hora, count });
            lastKey = key;
        }
        result.push({ type: 'venta', data: v });
    }
    return result;
};

