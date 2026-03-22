// React
import { useState, useMemo } from 'react';

// External libraries
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import {BasicTableLayout} from '@/components/tables/index';

import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { DiagnosisStateChip, DiagnosisRecordStateChip, DiagnosisSeverityChip } from '@diagnoses/components/ui/DiagnosisChips';
import UpdateDiagnosisStateForm from '@diagnoses/components/forms/UpdateDiagnosisStateForm';
import UpdateDiagnosisRecordStateForm from '@diagnoses/components/forms/UpdateDiagnosisRecordStateForm';

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

export default function DiagnosesTable({ diagnoses }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text

    const filteredDiagnoses = useSearchFilter(diagnoses, searchText, ['id', 'name']);

    const [updateDiagnosisStateRow, setUpdateDiagnosisStateRow] = useState(null);
    const [updateDiagnosisRecordStateRow, setUpdateDiagnosisRecordStateRow] = useState(null);

    const columns = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: 'Nombre',
                flex: 3,
            },
            {
                field: 'severity',
                headerName: 'Gravedad',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <DiagnosisSeverityChip value={value} />;
                },
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
                field: 'diagnosedAt',
                headerName: 'Fecha de diagnóstico',
                type: 'date',
                flex: 3,
                valueFormatter: (value) => formatDateTimeUTC(value),
            },
            {
                field: 'state',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <DiagnosisStateChip value={value} />;
                },
            },
            {
                field: 'recordState',
                headerName: 'Estado del registro',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <DiagnosisRecordStateChip value={value} />;
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
                        onUpdateState={setUpdateDiagnosisStateRow}
                        onUpdateRecordState={setUpdateDiagnosisRecordStateRow}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {updateDiagnosisStateRow && (
                <UpdateDiagnosisStateForm
                    diagnosis={updateDiagnosisStateRow}
                    handleClose={() => setUpdateDiagnosisStateRow(null)}
                />
            )}
            {updateDiagnosisRecordStateRow && (
                <UpdateDiagnosisRecordStateForm
                    diagnosis={updateDiagnosisRecordStateRow}
                    handleClose={() => setUpdateDiagnosisRecordStateRow(null)}
                />
            )}
            <BasicTableLayout
                rows={filteredDiagnoses}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por ID, nombre'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                actions={
                    <Button
                        variant='contained'
                        component={Link}
                        to='/clinical-records/diagnoses/new'
                        startIcon={<PersonAddAltIcon />}
                        loadingPosition='start'
                        sx={{ mr: 2 }}
                    >
                        Añadir diagnóstico
                    </Button>
                }
            />
        </>
    );
}
