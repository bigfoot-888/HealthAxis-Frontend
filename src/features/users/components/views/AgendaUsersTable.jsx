import { useState, useMemo } from 'react';

import { NestedTableLayout } from '@/components/tables';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { formatCreatedAt } from '@/utils/date-formatters';

import { ROLE_LABELS } from '@/config/roles';
import { UserStatusChip } from '@users/components/ui/UserChips';

export default function AgendaUsersTable({ users }) {
    const [searchText, setSearchText] = useState('');

    const filteredUsers = useSearchFilter(users ?? [], searchText, [
        'id',
        'name',
        'surname',
        'email',
        'phone',
        'status',
    ]);

    const columns = useMemo(() => {
        return [
            {
                field: 'id',
                headerName: 'ID',
                flex: 1,
            },
            {
                field: 'roles',
                headerName: 'Cargos',
                flex: 3,
                valueGetter: (value, row) => {
                    return row.roles ? row.roles.map((role) => ROLE_LABELS[role.name]).join(', ') : '';
                },
            },
            {
                field: 'name',
                headerName: 'Nombre',
                flex: 2,
            },
            {
                field: 'surname',
                headerName: 'Apellidos',
                flex: 2,
            },
            {
                field: 'email',
                headerName: 'Correo',
                flex: 3,
            },
            {
                field: 'phone',
                headerName: 'Teléfono',
                flex: 2,
            },
            {
                field: 'status',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <UserStatusChip value={value} />;
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de creación',
                flex: 2,
                hide: true,
                valueFormatter: (value) => formatCreatedAt(value),
            },
        ];
    }, []);

    return (
        <NestedTableLayout
            rows={filteredUsers}
            columns={columns}
            searchValue={searchText}
            searchPlaceholder='Busca por ID, nombre, apellidos o correo'
            onSearchChange={(e) => setSearchText(e.target.value)}
            sorting={{
                sortModel: [{ field: 'surname', sort: 'asc' }],
            }}
        />
    );
}
