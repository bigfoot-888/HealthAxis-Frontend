import { useState, useMemo } from 'react';
import EditIcon from '@mui/icons-material/Edit';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {NestedTableLayout} from '@/components/tables';
import { Link } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useNavigate } from 'react-router';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import UpdateTreatmentClinicalStatusForm from '@treatments/components/forms/UpdateTreatmentClinicalStatusForm';
import UpdateTreatmentStatusForm from '@treatments/components/forms/UpdateTreatmentStatusForm';
import { TREATMENT_CLINICAL_STATUS_CONFIG, } from '@/shared/constants/treatment.constants';
import { isTreatmentOver, isCancelled, isFinished } from '@treatments/utils/treatment-status.utils';

import { TREATMENT_COLUMNS } from '@treatments/config/treatment.columns';
import CreatePatientTreatmentForm from '@treatments/components/forms/CreatePatientTreatmentForm';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, patientUuid, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            {!isFinished(row) && (
                <GridActionsCellItem
                    showInMenu
                    icon={<SyncAltIcon />}
                    label='Actualizar estado'
                    onClick={() => onUpdateClinicalStatus(row)}
                ></GridActionsCellItem>
            )}
            {!isCancelled(row) && (
                <GridActionsCellItem
                    showInMenu
                    icon={<AutorenewIcon />}
                    label='Actualizar estado del registro'
                    onClick={() => onUpdateStatus(row)}
                ></GridActionsCellItem>
            )}
            <GridActionsCellItem
                icon={<EditIcon />}
                label='Editar tratamiento'
                component={Link}
                to={`/clinical-records/treatments/edit/${row.uuid}`}
                state={{ from: `/patients/${patientUuid}` }}
            />
        </GridActionsCell>
    );
}

export default function PatientTreatmentsTable({ treatments, patient }) {
    const [searchText, setSearchText] = useState(''); 
    const navigate = useNavigate(); 
    const filteredTreatments = useSearchFilter(treatments, searchText, null, [
        (t) => t.name,
        (t) => t.users?.map((u) => u.fullName).join(', '),
        (t) => TREATMENT_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label,
    ]);

    const [treatmentToUpdateClinicalStatus, setTreatmentToUpdateClinicalStatus] = useState(null);
    const [treatmentToUpdateStatus, setTreatmentToUpdateStatus] = useState(null);
    const [createTreatment, setCreateTreatment] = useState(null); 

    const columns = useMemo(() => {
        return [
            TREATMENT_COLUMNS.name,
            TREATMENT_COLUMNS.users,
            TREATMENT_COLUMNS.duration,
            TREATMENT_COLUMNS.startedAt,
            TREATMENT_COLUMNS.clinicalStatus,
            TREATMENT_COLUMNS.status,
            TREATMENT_COLUMNS.createdAt,
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onUpdateClinicalStatus={setTreatmentToUpdateClinicalStatus}
                        onUpdateStatus={setTreatmentToUpdateStatus}
                        patientUuid={patient.uuid}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {createTreatment && (
                <CreatePatientTreatmentForm
                    open={createTreatment}
                    handleClose={() => setCreateTreatment(false)}
                    patient={patient}
                />
            )}

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
                searchPlaceholder={'Busca por nombre, usuarios, estado clínico'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                onRowClick={(params) => {
                    navigate(`/clinical-records/treatments/${params.row.uuid}`);
                }}
                actions={
                    <Button
                        variant='contained'
                         onClick={() => setCreateTreatment(true)}
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
