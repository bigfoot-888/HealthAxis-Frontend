// React
import { useState, useMemo } from 'react';

// External libraries
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {NestedTableLayout} from '@/components/tables';
import { Link } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { TreatmentClinicalStatusChip, TreatmentStatusChip } from '@treatments/components/ui/TreatmentChips';

import UpdateTreatmentClinicalStatusForm from '@treatments/components/forms/UpdateTreatmentClinicalStatusForm';
import UpdateTreatmentStatusForm from '@treatments/components/forms/UpdateTreatmentStatusForm';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                showInMenu
                icon={<SyncAltIcon />}
                label='Actualizar estado'
                onClick={() => onUpdateClinicalStatus(row)}
            ></GridActionsCellItem>
            <GridActionsCellItem
                showInMenu
                icon={<AutorenewIcon />}
                label='Actualizar estado del registro'
                onClick={() => onUpdateStatus(row)}
            ></GridActionsCellItem>
        </GridActionsCell>
    );
}

export default function PatientTreatmentsTable({ treatments }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text

    const filteredTreatments = useSearchFilter(treatments, searchText, ['id', 'name']);

    const [treatmentToUpdateClinicalStatus, setTreatmentToUpdateClinicalStatus] = useState(null);
    const [treatmentToUpdateStatus, setTreatmentToUpdateStatus] = useState(null);

    const columns = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: 'Nombre',
                flex: 3,
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
                field: 'clinicalStatus',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <TreatmentClinicalStatusChip value={value} />;
                },
            },
            {
                field: 'status',
                headerName: 'Estado del registro',
                flex: 3,
                renderCell: (params) => {
                    const value = params.value;
                    return <TreatmentStatusChip value={value} />;
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
                        onUpdateClinicalStatus={setTreatmentToUpdateClinicalStatus}
                        onUpdateStatus={setTreatmentToUpdateStatus}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {treatmentToUpdateClinicalStatus && (
                <UpdateTreatmentClinicalStatusForm
                    treatment={treatmentToUpdateClinicalStatus}
                    handleClose={() => setTreatmentToUpdateClinicalStatus(null)}
                />
            )}
            {treatmentToUpdateStatus && (
                <UpdateTreatmentStatusForm
                    treatment={treatmentToUpdateStatus}
                    handleClose={() => setTreatmentToUpdateStatus(null)}
                />
            )}
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
