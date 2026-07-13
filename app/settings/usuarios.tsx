import { useAppTheme } from '@/State/context/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

function SectionLabel({ label, T }: { label: string; T: any }) {
    return (
        <Text style={{
            fontSize: 10,
            color: T.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontWeight: '700',
            marginTop: 24,
            marginBottom: 10,
            paddingHorizontal: 20,
        }}>{label}</Text>
    );
}

const team = [
    { name: 'Carlos Mendoza', role: 'Admin', email: 'admin@tienda.com', active: true, initial: 'C' },
    { name: 'María López', role: 'Vendedor', email: 'maria@tienda.com', active: true, initial: 'M' },
    { name: 'Ana García', role: 'Vendedor', email: 'ana@tienda.com', active: false, initial: 'A' },
];

const roles = [
    { name: 'Admin', count: 2, icon: 'shield-crown', color: '#FFB800' },
    { name: 'Vendedor', count: 1, icon: 'sale', color: '#3BA7FF' },
    { name: 'Almacenero', count: 0, icon: 'warehouse', color: '#9B6DFF' },
];

export default function Usuarios() {
    const { T } = useAppTheme();
    const router = useRouter();
    const s = makeStyles(T);

    return (
        <View style={s.screen}>
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Icon name="arrow-left" size={22} color={T.textPrimary} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Usuarios y roles</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={[s.addBtn, { backgroundColor: T.accentDim, borderColor: T.accent + '30' }]}>
                    <Icon name="account-plus" size={18} color={T.accent} />
                    <Text style={[s.addBtnText, { color: T.accent }]}>Invitar usuario</Text>
                </TouchableOpacity>

                <SectionLabel label="Equipo" T={T} />
                <View style={s.group}>
                    {team.map((u, i) => (
                        <View
                            key={u.email}
                            style={[
                                s.row,
                                i < team.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.border }
                            ]}
                        >
                            <View style={s.rowLeft}>
                                <View style={[s.avatar, { backgroundColor: u.active ? T.accentDim : T.surfaceAlt }]}>
                                    <Text style={[s.avatarText, { color: u.active ? T.accent : T.textMuted }]}>
                                        {u.initial}
                                    </Text>
                                    <View
                                        style={[
                                            s.statusDot,
                                            { backgroundColor: u.active ? T.green : T.textMuted, borderColor: T.surface }
                                        ]}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={s.nameRow}>
                                        <Text style={[s.userName, { color: T.textPrimary }]}>{u.name}</Text>
                                        <View
                                            style={[
                                                s.roleBadge,
                                                {
                                                    backgroundColor: u.role === 'Admin' ? T.amber + '18' : T.blue + '18',
                                                    borderColor: (u.role === 'Admin' ? T.amber : T.blue) + '30',
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    s.roleText,
                                                    { color: u.role === 'Admin' ? T.amber : T.blue }
                                                ]}
                                            >
                                                {u.role}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[s.userEmail, { color: T.textMuted }]}>{u.email}</Text>
                                </View>
                            </View>
                            <View style={[s.statusBadge, { backgroundColor: u.active ? T.green + '18' : T.red + '18' }]}>
                                <Text style={[s.statusText, { color: u.active ? T.green : T.red }]}>
                                    {u.active ? 'Activo' : 'Inactivo'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <SectionLabel label="Roles disponibles" T={T} />
                <View style={s.group}>
                    {roles.map((r, i) => (
                        <TouchableOpacity
                            key={r.name}
                            style={[
                                s.row,
                                i < roles.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.border }
                            ]}
                        >
                            <View style={s.rowLeft}>
                                <View style={[s.roleIcon, { backgroundColor: r.color + '18' }]}>
                                    <Icon name={r.icon as any} size={20} color={r.color} />
                                </View>
                                <View>
                                    <Text style={[s.rowTitle, { color: T.textPrimary }]}>{r.name}</Text>
                                    <Text style={[s.rowSub, { color: T.textMuted }]}>
                                        {r.count} {r.count === 1 ? 'usuario' : 'usuarios'}
                                    </Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={18} color={T.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

function makeStyles(T: any) {
    return StyleSheet.create({
        screen: { flex: 1, backgroundColor: T.bg },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 20,
            paddingTop: 56,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: T.border,
        },
        backBtn: {
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: T.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: T.textPrimary,
        },
        addBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 16,
            borderRadius: T.radiusLg,
            padding: 14,
            borderWidth: 1,
        },
        addBtnText: {
            fontSize: 14,
            fontWeight: '700',
        },
        group: {
            marginHorizontal: 20,
            backgroundColor: T.surface,
            borderRadius: T.radiusXl,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 14,
        },
        rowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        },
        avatarText: {
            fontSize: 16,
            fontWeight: '800',
        },
        statusDot: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            borderRadius: 5,
            borderWidth: 2,
        },
        nameRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        userName: {
            fontSize: 14,
            fontWeight: '700',
        },
        roleBadge: {
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderWidth: 1,
        },
        roleText: {
            fontSize: 10,
            fontWeight: '700',
        },
        userEmail: {
            fontSize: 12,
            marginTop: 2,
        },
        statusBadge: {
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        statusText: {
            fontSize: 11,
            fontWeight: '700',
        },
        roleIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        rowTitle: {
            fontSize: 14,
            fontWeight: '600',
        },
        rowSub: {
            fontSize: 11,
            marginTop: 2,
        },
    });
}
