import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Link } from 'react-router';

import { useSearchFilter } from '@/hooks/useSearchFilter';

import AlertDialog from '@/components/dialogs/AlertDialog';
import { NestedTableLayout } from '@/components/tables';

import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';
import { handleApiError } from '@/utils/handle-errors';
import CreateUserAppointmentForm from '../forms/CreateUserAppointmentForm';
import { APPOINTMENT_COLUMNS } from '@appointments/config/appointment.columns';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';

import { isCompleted, isCheckedIn, isScheduled, isAppointmentOver } from '@appointments/utils/appointment-status.utils';
import { useSnackbar } from '@/app/SnackBarContext';
import { invalidateEditAppointmentQueries } from '../../utils/appointment-query.utils';
import { useQueryClient } from '@tanstack/react-query';

function ActionsCell({ row, onCancel, onComplete, onCheckIn, userUuid, ...gridParams }) {
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

            {!isAppointmentOver(row) && <GridActionsCellItem
                icon={<EditIcon />}
                label='Editar cita'
                component={Link}
                to={`/appointments/edit/${row.uuid}`}
                state={{ from: `/users/${userUuid}` }}
            />
}
            {!isAppointmentOver(row) && (
                <GridActionsCellItem
                    showInMenu
                    icon={<HighlightOffIcon />}
                    label='Cancelar cita'
                    onClick={() => onCancel(row)}
                />
            )}
        </GridActionsCell>
    );
}

export default function UserAppointmentsTable({ user, appointments }) {
    const [searchText, setSearchText] = useState('');
    const { showSnackbar } = useSnackbar();
    const [error, setError] = useState(null); 
    const queryClient = useQueryClient(); 

    const filteredAppointments = useSearchFilter(appointments, searchText, null, [
        (a) => a.reason,
        (a) => a.patient.fullName,
        (a) => APPOINTMENT_STATUS_CONFIG[a.status].label,
        (a) => formatDateTimeUTC(a.startTime),
    ]);

    const [appointmentToComplete, setAppointmentToComplete] = useState(null);
    const [appointmentToCheckIn, setAppointmentToCheckIn] = useState(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const [createAppointment, setCreateAppointment] = useState(false);

    const handleCompleteAppointment = async (row) => {
        try {
            await updateAppointmentStatus(row.uuid, 'COMPLETED');
            invalidateEditAppointmentQueries(queryClient, row)
            setAppointmentToComplete(null);
            showSnackbar({ message: 'Cita completada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCheckInAppointment = async (row) => {
        try {
            await updateAppointmentStatus(row.uuid, 'CHECKED_IN');
            invalidateEditAppointmentQueries(queryClient, row);
            setAppointmentToCheckIn(null);
            showSnackbar({ message: 'Cita registrada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const columns = useMemo(() => {
        return [
            APPOINTMENT_COLUMNS.reason,
            APPOINTMENT_COLUMNS.startTime,
            APPOINTMENT_COLUMNS.patient,
            APPOINTMENT_COLUMNS.location,
            APPOINTMENT_COLUMNS.status,
            APPOINTMENT_COLUMNS.createdAt,
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
                        userUuid={user.uuid}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {createAppointment && (
                <CreateUserAppointmentForm
                    open={createAppointment}
                    handleClose={() => setCreateAppointment(false)}
                    user={user}
                />
            )}
            {appointmentToComplete && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToComplete(null)}
                    handleConfirm={() => handleCompleteAppointment(appointmentToComplete)}
                    title={`Completar cita: ${appointmentToComplete.patient.fullName}`}
                    content='La cita será completada. Esta acción es irreversible.'
                    error={error}
                    onErrorClose={()=>setError(null)}
                />
            )}

            {appointmentToCheckIn && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToCheckIn(null)}
                    handleConfirm={() => handleCheckInAppointment(appointmentToCheckIn)}
                    title={`Check-in de cita: ${appointmentToCheckIn.patient.fullName}`}
                    content='Se marcará al paciente como presente.'
                    error={error}
                    onErrorClose={()=>setError(null)}
                />
            )}

            {appointmentToCancel && (
                <CancelAppointmentForm
                    appointment={appointmentToCancel}
                    handleClose={() => setAppointmentToCancel(null)}
                />
            )}

            <NestedTableLayout
                rows={filteredAppointments}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder='Busca por motivo, paciente, estado, fecha'
                onSearchChange={(e) => setSearchText(e.target.value)}
                tableSpecificVisibility={{ priority: false }}
                actions={
                    <Button
                        variant='contained'
                        onClick={() => setCreateAppointment(true)}
                        startIcon={<PersonAddAltIcon />}
                        sx={{ mr: 2 }}
                    >
                        Añadir cita
                    </Button>
                }
                onRowClick={(params) => {
                    navigate(`/appointments/${params.row.uuid}`);
                }}
            />
        </>
    );
}
