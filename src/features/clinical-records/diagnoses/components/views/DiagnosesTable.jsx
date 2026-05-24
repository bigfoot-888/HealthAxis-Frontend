import { useState, useMemo } from 'react';
import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate, useOutletContext } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { BasicTableLayout } from '@/components/tables/index';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import UpdateDiagnosisClinicalStatusForm from '@diagnoses/components/forms/UpdateDiagnosisClinicalStatusForm';
import UpdateDiagnosisStatusForm from '@diagnoses/components/forms/UpdateDiagnosisStatusForm';
import { DIAGNOSIS_COLUMNS } from '@diagnoses/config/diagnosis.columns';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';
import { isDiagnosisOver, isDiagnosisValid } from '@diagnoses/utils/diagnosis-status.utils';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, ...gridParams }) {
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
                showInMenu
                icon={<EditIcon />}
                label='Editar diagnóstico'
                component={Link}
                to={`/clinical-records/diagnoses/edit/${row.uuid}`}
                state={{ from: `/clinical-records/diagnoses` }}
            />
        </GridActionsCell>
    );
}

export default function DiagnosesTable({ diagnoses }) {
    const {searchText} = useOutletContext(); 
    const filteredDiagnoses = useSearchFilter(diagnoses, searchText, null, [
        (t) => t.name,
        (t) => t.patient.fullName,
        (t) => t.users?.map((u) => u.fullName).join(', '),
        (t) => DIAGNOSIS_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label,
    ]);

    const navigate = useNavigate();
    const [updateDiagnosisClinicalStatusRow, setUpdateDiagnosisClinicalStatusRow] = useState(null);
    const [updateDiagnosisStatusRow, setUpdateDiagnosisStatusRow] = useState(null);
    const [error, setError] = useState(null); 

    const columns = useMemo(() => {
        return [
            DIAGNOSIS_COLUMNS.name,
            DIAGNOSIS_COLUMNS.severity,
            DIAGNOSIS_COLUMNS.patient,
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
                    handleClose={() => {setError(null);setUpdateDiagnosisClinicalStatusRow(null)}}
                />
            )}
            {updateDiagnosisStatusRow && (
                <UpdateDiagnosisStatusForm
                    diagnosis={updateDiagnosisStatusRow}
                    handleClose={() => {setError(null);setUpdateDiagnosisStatusRow(null)}}
                />
            )}
            <BasicTableLayout
                rows={filteredDiagnoses}
                columns={columns}
                onRowClick={(params) => {
                    navigate(`/clinical-records/diagnoses/${params.row.uuid}`);
                }}
            />
        </>
    );
}
