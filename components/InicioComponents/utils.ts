
import T from "@/constants/THEME";

export const fmt = (n: number) =>
    `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export const formatHour = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleTimeString('es-PE', {
            hour: '2-digit', minute: '2-digit',
        });
    } catch { return ''; }
};



export const ESTADO_COLOR: Record<string, string> = {
    aceptado: T.green, pendiente: T.amber, anulado: T.red, cancelado: T.textSecondary,
};
