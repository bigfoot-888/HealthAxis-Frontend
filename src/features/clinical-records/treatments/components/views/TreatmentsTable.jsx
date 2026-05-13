import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import BasicTableLayout from '@/components/tables/BasicTableLayout';
import { Link, useNavigate, useOutletContext } from 'react-router';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';

import { useSearchFilter } from '@/hooks/useSearchFilter';

import UpdateTreatmentClinicalStatusForm from '@treatments/components/forms/UpdateTreatmentClinicalStatusForm';
import UpdateTreatmentStatusForm from '@treatments/components/forms/UpdateTreatmentStatusForm';
import { TREATMENT_COLUMNS } from '@treatments/config/treatment.columns';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';

import { isTreatmentOver, isCancelled, isFinished } from '@treatments/utils/treatment-status.utils';

function ActionsCell({ row, onUpdateClinicalStatus, onUpdateStatus, ...gridParams }) {
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
                showInMenu
                icon={<EditIcon />}
                label='Editar tratamiento'
                component={Link}
                to={`/clinical-records/treatments/edit/${row.uuid}`}
                state={{ from: `/clinical-records/treatments` }}
            />
        </GridActionsCell>
    );
}

export default function TreatmentsTable({ treatments }) {
    const { searchText } = useOutletContext();
    const filteredTreatments = useSearchFilter(treatments, searchText, null, [
        t => t.name,
        t => t.patient.fullName,
        t => t.users?.map(u => u.fullName).join(', '),
        t => TREATMENT_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label,
    ]);

    const navigate = useNavigate();
    const [treatmentToUpdateClinicalStatus, setTreatmentToUpdateClinicalStatus] = useState(null);
    const [treatmentToUpdateStatus, setTreatmentToUpdateStatus] = useState(null);

    const columns = useMemo(() => {
        return [
            TREATMENT_COLUMNS.name,
            TREATMENT_COLUMNS.patient,
            TREATMENT_COLUMNS.users,
            TREATMENT_COLUMNS.duration,
            TREATMENT_COLUMNS.clinicalStatus,
            TREATMENT_COLUMNS.status,
            TREATMENT_COLUMNS.createdAt,
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: params => (
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
                    handleClose={() => {setError(null);setTreatmentToUpdateClinicalStatus(null)}}
                />
            )}
            {treatmentToUpdateStatus && (
                <UpdateTreatmentStatusForm
                    treatment={treatmentToUpdateStatus}
                    handleClose={() => {setError(null);setTreatmentToUpdateStatus(null)}}
                />
            )}
            <BasicTableLayout
                rows={filteredTreatments}
                columns={columns}
                onRowClick={params => {
                    navigate(`/clinical-records/treatments/${params.row.uuid}`);
                }}
            />
        </>
    );
}
