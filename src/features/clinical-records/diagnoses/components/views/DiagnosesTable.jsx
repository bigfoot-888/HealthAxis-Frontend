// React
import { useState, useMemo } from 'react';

// External libraries
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link, useNavigate } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { BasicTableLayout } from '@/components/tables/index';

import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import {
    DiagnosisClinicalStatusChip,
    DiagnosisStatusChip,
    DiagnosisSeverityChip,
} from '@diagnoses/components/ui/DiagnosisChips';
import UpdateDiagnosisClinicalStatusForm from '@diagnoses/components/forms/UpdateDiagnosisClinicalStatusForm';
import UpdateDiagnosisStatusForm from '@diagnoses/components/forms/UpdateDiagnosisStatusForm';

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

export default function DiagnosesTable({ diagnoses }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text
    const filteredDiagnoses = useSearchFilter(diagnoses, searchText, ['id', 'name']);
    const navigate = useNavigate();
    const [updateDiagnosisClinicalStatusRow, setUpdateDiagnosisClinicalStatusRow] = useState(null);
    const [updateDiagnosisStatusRow, setUpdateDiagnosisStatusRow] = useState(null);

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
                field: 'clinicalStatus',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <DiagnosisClinicalStatusChip value={value} />;
                },
            },
            {
                field: 'status',
                headerName: 'Estado del registro',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <DiagnosisStatusChip value={value} />;
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
                        onUpdateClinicalStatus={setUpdateDiagnosisClinicalStatusRow}
                        onUpdateStatus={setUpdateDiagnosisStatusRow}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {updateDiagnosisClinicalStatusRow && (
                <UpdateDiagnosisClinicalStatusForm
                    diagnosis={updateDiagnosisClinicalStatusRow}
                    handleClose={() => setUpdateDiagnosisClinicalStatusRow(null)}
                />
            )}
            {updateDiagnosisStatusRow && (
                <UpdateDiagnosisStatusForm
                    diagnosis={updateDiagnosisStatusRow}
                    handleClose={() => setUpdateDiagnosisStatusRow(null)}
                />
            )}
            <BasicTableLayout
                rows={filteredDiagnoses}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por ID, nombre'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                onRowClick={(params) => {
                    navigate(`/clinical-records/diagnoses/${params.row.uuid}`);
                }}
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
