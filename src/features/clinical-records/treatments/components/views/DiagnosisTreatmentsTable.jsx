import { useState, useMemo } from 'react';

import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { NestedTableLayout } from '@/components/tables';
import { Link } from 'react-router';

import { formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { TreatmentClinicalStatusChip, TreatmentStatusChip } from '@treatments/components/ui/TreatmentChips';

export default function DiagnosisTreatmentsTable({ treatments }) {
    const [searchText, setSearchText] = useState('');

    const filteredTreatments = useSearchFilter(treatments, searchText, ['id', 'name']);

    const columns = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: 'Tratamiento',
                flex: 3,
            },
            {
                field: 'users',
                headerName: 'Profesionales',
                flex: 3,
                valueGetter: (value, row) => {
                    return row.users
                        ? row.users.map((user) => user.fullName).join(', ')
                        : '';
                },
            },
            {
                field: 'duration',
                headerName: 'Duración',
                flex: 2,
            },
            {
                field: 'clinicalStatus',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => (
                    <TreatmentClinicalStatusChip value={params.value} />
                ),
            },
            {
                field: 'status',
                headerName: 'Estado del registro',
                flex: 3,
                renderCell: (params) => (
                    <TreatmentStatusChip value={params.value} />
                ),
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha',
                flex: 2,
                valueFormatter: (value) => formatCreatedAt(value),
            },
        ];
    }, []);

    return (
        <NestedTableLayout
            rows={filteredTreatments}
            columns={columns}
            searchValue={searchText}
            searchPlaceholder={'Busca por ID, nombre'}
            onSearchChange={(e) => setSearchText(e.target.value)}
            actions={
                <Button
                    variant='contained'
                    component={Link}
                    to='/clinical-records/treatments/new'
                    startIcon={<PersonAddAltIcon />}
                    sx={{ mr: 2 }}
                >
                    Añadir tratamiento
                </Button>
            }
        />
    );
}