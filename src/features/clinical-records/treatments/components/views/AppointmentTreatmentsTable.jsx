import { useState, useMemo } from 'react';

import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { NestedTableLayout } from '@/components/tables';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { TREATMENT_COLUMNS } from '@treatments/config/treatment.columns';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import CreateAppointmentTreatmentForm from '@treatments/components/forms/CreateAppointmentTreatmentForm';
import { useNavigate } from 'react-router';
import UpdateTreatmentClinicalStatusForm from '../forms/UpdateTreatmentClinicalStatusForm';
import UpdateTreatmentStatusForm from '../forms/UpdateTreatmentStatusForm';
import { GridActionsCell, GridActionsCellItem } from '@mui/x-data-grid';

import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';

import { isTreatmentOver, isCancelled, isFinished } from '@treatments/utils/treatment-status.utils';
import { Link } from 'react-router';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, appointmentUuid, ...gridParams }) {
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
                state={{ from: `/appointments/${appointmentUuid}` }}
            />
        </GridActionsCell>
    );
}

export default function AppointmentTreatmentsTable({ treatments, appointment }) {
    const [searchText, setSearchText] = useState('');
    const [createTreatment, setCreateTreatment] = useState(false);
    const navigate = useNavigate();
    const [treatmentToUpdateClinicalStatus, setTreatmentToUpdateClinicalStatus] = useState(null);
    const [treatmentToUpdateStatus, setTreatmentToUpdateStatus] = useState(null);

    const filteredTreatments = useSearchFilter(treatments, searchText, null, [
        (t) => t.name,
        (t) => t.users?.map((u) => u.fullName).join(', '),
        (t) => TREATMENT_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label,
    ]);

    const columns = useMemo(() => {
        return [
            TREATMENT_COLUMNS.name,
            TREATMENT_COLUMNS.diagnosisName,
            TREATMENT_COLUMNS.users,
            TREATMENT_COLUMNS.duration,
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
                        appointmentUuid={appointment.uuid}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {createTreatment && (
                <CreateAppointmentTreatmentForm
                    open={createTreatment}
                    handleClose={() => setCreateTreatment(false)}
                    appointment={appointment}
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
                        sx={{ mr: 2 }}
                    >
                        Añadir tratamiento
                    </Button>
                }
            />
        </>
    );
}
