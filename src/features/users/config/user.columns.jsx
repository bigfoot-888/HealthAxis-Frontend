import { USER_STATUS_CONFIG } from '@/shared/constants/user.constants';
import { formatCreatedAt } from '@/utils/date-formatters';
import { UserStatusChip } from '@users/components/ui/UserChips';
import { ROLE_LABELS } from '@/config/roles';

export const USER_COLUMNS = {
    id: {
        field: 'id',
        headerName: 'ID',
        flex: 1,
    },
    roles: {
        field: 'roles',
        headerName: 'Cargos',
        flex: 3,
        valueGetter: (value, row) => {
            return row.roles ? row.roles.map((role) => ROLE_LABELS[role.name]).join(', ') : '';
        },
    },
    name: {
        field: 'name',
        headerName: 'Nombre',
        flex: 2,
    },
    surname: {
        field: 'surname',
        headerName: 'Apellidos',
        flex: 2,
    },
    email: {
        field: 'email',
        headerName: 'Correo',
        flex: 3,
    },
    phone: {
        field: 'phone',
        headerName: 'Teléfono',
        flex: 2,
    },
    status: {
        field: 'status',
        headerName: 'Estado',
        flex: 2,
        valueGetter: (value) => {
            return USER_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <UserStatusChip value={params.row.status} />;
        },
    },
    createdAt: {
        type: 'date',
        field: 'createdAt',
        headerName: 'Fecha de Creación',
        flex: 3,
        valueGetter: (value) => {
            const date = value instanceof Date ? value : new Date(value);
            return isNaN(date) ? null : date;
        },
        valueFormatter: (value) => formatCreatedAt(value),
    },
};
