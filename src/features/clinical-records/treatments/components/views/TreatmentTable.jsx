// React
import { useState, useMemo } from 'react';

// External libraries
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import BasicTableLayout from '@/components/tables/BasicTableLayout';
import { Link } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { TreatmentStateChip, TreatmentRecordStateChip } from '@treatments/components/ui/TreatmentChips';
import UpdateTreatmentStateForm from '@treatments/components/forms/UpdateTreatmentStateForm';
import UpdateTreatmentRecordStateForm from '@treatments/components/forms/UpdateTreatmentRecordStateForm';

function ActionsCell({ row, onUpdateState, onUpdateRecordState, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                showInMenu
                icon={<SyncAltIcon />}
                label='Actualizar estado'
                onClick={() => onUpdateState(row)}
            ></GridActionsCellItem>
            <GridActionsCellItem
                showInMenu
                icon={<AutorenewIcon />}
                label='Actualizar estado del registro'
                onClick={() => onUpdateRecordState(row)}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function TreatmentsTable({ treatments }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text

    const filteredTreatments = useSearchFilter(treatments, searchText, ['id', 'name']);

    const [treatmentToUpdateState, setTreatmentToUpdateState] = useState(null);
    const [treatmentToUpdateRecordState, setTreatmentToUpdateRecordState] = useState(null);

    const columns = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: 'Nombre',
                flex: 3,
            },
            {
                field: 'patient',
                headerName: 'Paciente',
                flex: 2,
                valueGetter: (value, row) => row.patient?.fullName || 'N/A',
            },
            {
                field: 'users',
                headerName: 'Profesionales',
                flex: 3,
                valueGetter: (value, row) => {
                    return row.users ? row.users.map((user) => user.fullName).join(', ') : '';
                },
            },
            {
                field: 'duration',
                headerName: 'Duración',
                flex: 2,
            },
            {
                type: 'date',
                field: 'startedAt',
                headerName: 'Inicio del tratamiento',
                flex: 3,
                hide: true,
                valueFormatter: (value) => formatDateTimeUTC(value),
            },
            {
                field: 'state',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <TreatmentStateChip value={value} />;
                },
            },
            {
                field: 'recordState',
                headerName: 'Estado del registro',
                flex: 3,
                renderCell: (params) => {
                    const value = params.value;
                    return <TreatmentRecordStateChip value={value} />;
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de Creación',
                flex: 2,
                hide: true,
                valueFormatter: (value) => formatCreatedAt(value),
            },
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onUpdateState={setTreatmentToUpdateState}
                        onUpdateRecordState={setTreatmentToUpdateRecordState}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {treatmentToUpdateState && (
                <UpdateTreatmentStateForm
                    treatment={treatmentToUpdateState}
                    handleClose={() => setTreatmentToUpdateState(null)}
                />
            )}
            {treatmentToUpdateRecordState && (
                <UpdateTreatmentRecordStateForm
                    treatment={treatmentToUpdateRecordState}
                    handleClose={() => setTreatmentToUpdateRecordState(null)}
                />
            )}
            <BasicTableLayout
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
                        loadingPosition='start'
                        sx={{ mr: 2 }}
                    >
                        Añadir tratamiento
                    </Button>
                }
            />
        </>
    );
}
