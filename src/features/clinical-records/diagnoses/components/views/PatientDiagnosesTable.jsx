import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link, useNavigate } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';

import {NestedTableLayout} from '@/components/tables/index';

import { useSearchFilter } from '@/hooks/useSearchFilter';

import UpdateDiagnosisClinicalStatusForm from '@diagnoses/components/forms/UpdateDiagnosisClinicalStatusForm';
import UpdateDiagnosisStatusForm from '@diagnoses/components/forms/UpdateDiagnosisStatusForm';
import { DIAGNOSIS_COLUMNS } from '@diagnoses/config/diagnosis.columns';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';

import { isDiagnosisOver, isDiagnosisValid } from '@diagnoses/utils/diagnosis-status.utils';
import CreatePatientDiagnosisForm from '../forms/CreatePatientDiagnosisForm';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, patientUuid, ...gridParams }) {
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
                state={{ from: `/patients/${patientUuid}` }}
            />
        </GridActionsCell>
    );
}

export default function PatientDiagnosesTable({ diagnoses, patient }) {
    const [searchText, setSearchText] = useState('');
    const [createDiagnosis, setCreateDiagnosis] = useState(false);
    const navigate = useNavigate();

    const filteredDiagnoses = useSearchFilter(diagnoses, searchText, null, [
        (t) => t.name,
        (t) => t.users?.map((u) => u.fullName).join(', '),
        (t) => DIAGNOSIS_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label,
    ]);

    const [updateDiagnosisClinicalStatusRow, setUpdateDiagnosisClinicalStatusRow] = useState(null);
    const [updateDiagnosisStatusRow, setUpdateDiagnosisStatusRow] = useState(null);

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
                flex: 3,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onUpdateClinicalStatus={setUpdateDiagnosisClinicalStatusRow}
                        onUpdateStatus={setUpdateDiagnosisStatusRow}
                        patientUuid={patient.uuid}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            <CreatePatientDiagnosisForm
                open={createDiagnosis}
                handleClose={() => setCreateDiagnosis(false)}
                patient={patient}
            />

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
