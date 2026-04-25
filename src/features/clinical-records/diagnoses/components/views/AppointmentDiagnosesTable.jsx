import { useState, useMemo } from 'react';

import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { NestedTableLayout } from '@/components/tables';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import {
    DiagnosisClinicalStatusChip,
    DiagnosisStatusChip,
    DiagnosisSeverityChip,
} from '@diagnoses/components/ui/DiagnosisChips';

import UpdateDiagnosisClinicalStatusForm from '@diagnoses/components/forms/UpdateDiagnosisClinicalStatusForm';
import UpdateDiagnosisStatusForm from '@diagnoses/components/forms/UpdateDiagnosisStatusForm';

import CreateAppointmentDiagnosisForm from '@diagnoses/components/forms/CreateAppointmentDiagnosisForm';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            <GridActionsCellItem
                showInMenu
                icon={<SyncAltIcon />}
                label='Actualizar estado clínico'
                onClick={() => onUpdateClinicalStatus(row)}
            />
            <GridActionsCellItem
                showInMenu
                icon={<AutorenewIcon />}
                label='Actualizar estado del registro'
                onClick={() => onUpdateStatus(row)}
            />
        </GridActionsCell>
    );
}

export default function AppointmentDiagnosesTable({ diagnoses, appointment, refetch }) {
    const [searchText, setSearchText] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const [updateDiagnosisClinicalStatusRow, setUpdateDiagnosisClinicalStatusRow] = useState(null);
    const [updateDiagnosisStatusRow, setUpdateDiagnosisStatusRow] = useState(null);

    const filteredDiagnoses = useSearchFilter(diagnoses, searchText, ['id', 'name']);

    const columns = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: 'Diagnóstico',
                flex: 3,
            },
            {
                field: 'severity',
                headerName: 'Gravedad',
                flex: 2,
                renderCell: (params) => <DiagnosisSeverityChip value={params.value} />,
            },
            {
                field: 'users',
                headerName: 'Profesionales',
                flex: 3,
                valueGetter: (value, row) =>
                    row.users ? row.users.map((u) => u.fullName).join(', ') : '',
            },
            {
                field: 'diagnosedAt',
                headerName: 'Fecha diagnóstico',
                type: 'date',
                flex: 3,
                valueFormatter: (value) => formatDateTimeUTC(value),
            },
            {
                field: 'clinicalStatus',
                headerName: 'Estado clínico',
                flex: 2,
                renderCell: (params) => <DiagnosisClinicalStatusChip value={params.value} />,
            },
            {
                field: 'status',
                headerName: 'Estado registro',
                flex: 2,
                renderCell: (params) => <DiagnosisStatusChip value={params.value} />,
            },
            {
                field: 'actions',
                type: 'actions',
                flex: 2,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onUpdateClinicalStatus={setUpdateDiagnosisClinicalStatusRow}
                        onUpdateStatus={setUpdateDiagnosisStatusRow}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {/* Create dialog */}
            <CreateAppointmentDiagnosisForm
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                appointment={appointment}
            />

            {updateDiagnosisClinicalStatusRow && (
                <UpdateDiagnosisClinicalStatusForm
                    diagnosis={updateDiagnosisClinicalStatusRow}
                    handleClose={() => {
                        setUpdateDiagnosisClinicalStatusRow(null);
                        refetch();
                    }}
                />
            )}

            {updateDiagnosisStatusRow && (
                <UpdateDiagnosisStatusForm
                    diagnosis={updateDiagnosisStatusRow}
                    handleClose={() => {
                        setUpdateDiagnosisStatusRow(null);
                        refetch();
                    }}
                />
            )}

            <NestedTableLayout
                rows={filteredDiagnoses}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por ID, nombre'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                actions={
                    <Button
                        variant='contained'
                        startIcon={<PersonAddAltIcon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{ mr: 2 }}
                    >
                        Añadir diagnóstico
                    </Button>
                }
            />
        </>
    );
}