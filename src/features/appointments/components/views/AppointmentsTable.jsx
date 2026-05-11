import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Link, useNavigate } from 'react-router';

import { useSearchFilter } from '@/hooks/useSearchFilter';
import { formatDateTimeUTC } from '@/utils/date-formatters';

import AlertDialog from '@/components/dialogs/AlertDialog';
import BasicTableLayout from '@/components/tables/BasicTableLayout';

import { useAppointments } from '@appointments/hooks/useAppointments';
import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';
import { handleApiError } from '@/utils/handle-errors';
import AddClinicalDataStepperForm from '@appointments/components/forms/AddClinicalDataStepperForm';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { APPOINTMENT_COLUMNS } from '@appointments/config/appointment.columns';
import { isCompleted, isCheckedIn, isScheduled, isAppointmentOver } from '@appointments/utils/appointment-status.utils';
import { useSnackbar } from '@/app/SnackBarContext';

function ActionsCell({ row, onCancel, onComplete, onCheckIn, onAddClinicalData, ...gridParams }) {
    return (
        <GridActionsCell {...gridParams}>
            {!isCompleted(row) && isCheckedIn(row) && (
                <GridActionsCellItem
                    icon={
                        <Tooltip title='Completar cita'>
                            <TaskAltIcon color='primary' />
                        </Tooltip>
                    }
                    label='Completar cita'
                    onClick={() => onComplete(row)}
                />
            )}
            {isScheduled(row) && (
                <GridActionsCellItem
                    icon={
                        <Tooltip title='Validar check-in'>
                            <HowToRegIcon color='secondary' />
                        </Tooltip>
                    }
                    label='Validar check-in'
                    onClick={() => onCheckIn(row)}
                />
            )}
            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                label='Editar cita'
                component={Link}
                to={`/appointments/edit/${row.uuid}`}
                state={{ from: `/appointments` }}
            />
            {!isAppointmentOver(row) && (
                <GridActionsCellItem
                    showInMenu
                    icon={<HighlightOffIcon />}
                    label='Cancelar cita'
                    onClick={() => onCancel(row)}
                ></GridActionsCellItem>
            )}
        </GridActionsCell>
    );
}

export default function AppointmentsTable({ appointments, setError, searchText }) {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const filteredAppointments = useSearchFilter(appointments, searchText, null, [
        (a) => a.reason,
        (a) => a.user.fullName,
        (a) => a.patient.fullName,
        (a) => APPOINTMENT_STATUS_CONFIG[a.status].label,
        (a) => formatDateTimeUTC(a.startTime),
    ]);

    const { refetch } = useAppointments();
    const [appointmentToComplete, setAppointmentToComplete] = useState(null);
    const [appointmentToCheckIn, setAppointmentToCheckIn] = useState(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const handleCompleteAppointment = async (row) => {
        try {
            await updateAppointmentStatus(row.uuid, 'COMPLETED');
            refetch();
            setAppointmentToComplete(null);
            showSnackbar({ message: 'Cita completada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCheckInAppointment = async (row) => {
        try {
            await updateAppointmentStatus(row.uuid, 'CHECKED_IN');
            refetch();
            setAppointmentToCheckIn(null);
            showSnackbar({ message: 'Cita registrada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const computedAppointments = useMemo(() => {
        if (!filteredAppointments) return [];

        const now = new Date();

        const getPriority = (row) => {
            if (row.status === 'CHECKED_IN') return 0;
            if (row.status === 'SCHEDULED') return 1;
            if (new Date(row.startTime) >= now) return 2;
            return 3;
        };

        return filteredAppointments.map((row) => ({
            ...row,
            priority: getPriority(row),
        }));
    }, [filteredAppointments]);

    const columns = useMemo(() => {
        return [
            APPOINTMENT_COLUMNS.reason,
            APPOINTMENT_COLUMNS.startTime,
            APPOINTMENT_COLUMNS.patient,
            APPOINTMENT_COLUMNS.user,
            APPOINTMENT_COLUMNS.location,
            APPOINTMENT_COLUMNS.status,
            APPOINTMENT_COLUMNS.createdAt,
            APPOINTMENT_COLUMNS.priority,
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onCancel={setAppointmentToCancel}
                        onComplete={setAppointmentToComplete}
                        onCheckIn={setAppointmentToCheckIn}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {appointmentToComplete && (
                <AlertDialog
                    open={true}
                    handleClose={() => setAppointmentToComplete(null)}
                    handleConfirm={() => handleCompleteAppointment(appointmentToComplete)}
                    title={`Completar cita: ${appointmentToComplete.patient.fullName} - Dr. / Dra. ${appointmentToComplete.user.fullName}`}
                    content='Esta acción es irreversible. Al finalizar, la cita será dada como realizada..'
                />
            )}
            {appointmentToCheckIn && (
                <AlertDialog
                    open={!!appointmentToCheckIn}
                    handleClose={() => setAppointmentToCheckIn(null)}
                    handleConfirm={() => handleCheckInAppointment(appointmentToCheckIn)}
                    title={`Check-in de cita: ${appointmentToCheckIn.patient.fullName}  - Dr. / Dra. ${appointmentToCheckIn.user.fullName}`}
                    content='Esta acción es reversible. Al finalizar, se considerará al paciente presente para la cita.'
                />
            )}
            {appointmentToCancel && (
                <CancelAppointmentForm
                    appointment={appointmentToCancel}
                    handleClose={() => setAppointmentToCancel(null)}
                    refetch={refetch}
                />
            )}

            <BasicTableLayout
                rows={computedAppointments}
                columns={columns}
                sorting={{
                    sortModel: [{ field: 'priority', sort: 'asc' }],
                }}
                tableSpecificVisibility={{ priority: false }}
                onRowClick={(params) => {
                    navigate(`/appointments/${params.row.uuid}`);
                }}
            />
        </>
    );
}
