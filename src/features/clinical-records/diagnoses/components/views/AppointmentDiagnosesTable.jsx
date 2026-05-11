import { useState, useMemo } from 'react';

import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { NestedTableLayout } from '@/components/tables';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useSearchFilter } from '@/hooks/useSearchFilter';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router';
import UpdateDiagnosisClinicalStatusForm from '@diagnoses/components/forms/UpdateDiagnosisClinicalStatusForm';
import UpdateDiagnosisStatusForm from '@diagnoses/components/forms/UpdateDiagnosisStatusForm';

import CreateAppointmentDiagnosisForm from '@diagnoses/components/forms/CreateAppointmentDiagnosisForm';
import { DIAGNOSIS_COLUMNS } from '@diagnoses/config/diagnosis.columns';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';

import { isDiagnosisOver, isDiagnosisValid } from '@diagnoses/utils/diagnosis-status.utils';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, appointmentUuid, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            {!isDiagnosisOver(row) && (
                <GridActionsCellItem
                    showInMenu
                    icon={<SyncAltIcon />}
                    label='Actualizar estado'
                    onClick={() => onUpdateClinicalStatus(row)}
                />
            )}
            {isDiagnosisValid(row) && (
                <GridActionsCellItem
                    showInMenu
                    icon={<AutorenewIcon />}
                    label='Actualizar estado del registro'
                    onClick={() => onUpdateStatus(row)}
                />
            )}
            <GridActionsCellItem
                icon={<EditIcon />}
                label='Editar diagnóstico'
                component={Link}
                to={`/clinical-records/diagnoses/edit/${row.uuid}`}
                state={{ from: `/appointments/${appointmentUuid}` }}
            />
        </GridActionsCell>
    );
}

export default function AppointmentDiagnosesTable({ diagnoses, appointment, refetch }) {
    const [searchText, setSearchText] = useState('');
    const [createDiagnosis, setCreateDiagnosis] = useState(false);
    const navigate = useNavigate();

    const [updateDiagnosisClinicalStatusRow, setUpdateDiagnosisClinicalStatusRow] = useState(null);
    const [updateDiagnosisStatusRow, setUpdateDiagnosisStatusRow] = useState(null);

    const filteredDiagnoses = useSearchFilter(diagnoses, searchText, null, [
        (t) => t.name,
        (t) => t.users?.map((u) => u.fullName).join(', '),
        (t) => DIAGNOSIS_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label,
    ]);

    const columns = useMemo(() => {
        return [
            DIAGNOSIS_COLUMNS.name,
            DIAGNOSIS_COLUMNS.severity,
            DIAGNOSIS_COLUMNS.users,
            DIAGNOSIS_COLUMNS.diagnosedAt,
            DIAGNOSIS_COLUMNS.clinicalStatus,
            DIAGNOSIS_COLUMNS.status,
            DIAGNOSIS_COLUMNS.createdAt,
            {
                field: 'actions',
                type: 'actions',
                flex: 2,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onUpdateClinicalStatus={setUpdateDiagnosisClinicalStatusRow}
                        onUpdateStatus={setUpdateDiagnosisStatusRow}
                        appointmentUuid={appointment.uuid}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {/* Create dialog */}
            <CreateAppointmentDiagnosisForm
                open={createDiagnosis}
                handleClose={() => setCreateDiagnosis(false)}
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
                searchPlaceholder={'Busca por nombre, usuarios, estado clínico'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                onRowClick={(params) => {
                    navigate(`/clinical-records/diagnoses/${params.row.uuid}`);
                }}
                actions={
                    <Button
                        variant='contained'
                        startIcon={<PersonAddAltIcon />}
                        onClick={() => setCreateDiagnosis(true)}
                        sx={{ mr: 2 }}
                    >
                        Añadir diagnóstico
                    </Button>
                }
            />
        </>
    );
}
