import { useState, useMemo } from 'react';

import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router';

import { useSearchFilter } from '@/hooks/useSearchFilter';

import AlertDialog from '@/components/dialogs/AlertDialog';
import {NestedTableLayout} from '@/components/tables';

import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';
import { handleApiError } from '@/utils/handle-errors';
import { useSnackbar } from '@/app/SnackBarContext';
import { APPOINTMENT_COLUMNS } from '@appointments/config/appointment.columns';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import CreatePatientAppointmentForm from '@appointments/components/forms/CreatePatientAppointmentForm';
import { isCompleted, isCheckedIn, isScheduled, isAppointmentOver} from '@appointments/utils/appointment-status.utils';
import { invalidateEditAppointmentQueries } from '../../utils/appointment-query.utils';
import { useQueryClient } from '@tanstack/react-query';

function ActionsCell({ row, onCancel, onComplete, onCheckIn, ...gridParams }) {
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

export default function PatientAppointmentsTable({ appointments, patient }) {
    const [searchText, setSearchText] = useState('');
    const { showSnackbar } = useSnackbar();
    const [error, setError] = useState(null); 
    const queryClient = useQueryClient(); 

    const filteredAppointments = useSearchFilter(appointments, searchText, null, [
        (a) => a.reason,
        (a) => a.user.fullName,
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
            console.log(row)
            await updateAppointmentStatus(row.uuid, 'CHECKED_IN');
            invalidateEditAppointmentQueries(queryClient, row)
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
                    error={error}
                    onErrorClose={()=>setError(null)}
                />
            )}
            {appointmentToCheckIn && (
                <AlertDialog
                    open={!!appointmentToCheckIn}
                    handleClose={() => setAppointmentToCheckIn(null)}
                    handleConfirm={() => handleCheckInAppointment(appointmentToCheckIn)}
                    title={`Check-in de cita: ${appointmentToCheckIn.patient.fullName}  - Dr. / Dra. ${appointmentToCheckIn.user.fullName}`}
                    content='Esta acción es reversible. Al finalizar, se considerará al paciente presente para la cita.'
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
            {createAppointment && (
                <CreatePatientAppointmentForm
                    open={createAppointment}
                    handleClose={() => setCreateAppointment(false)}
                    patient={patient}
                />
            )}

            <NestedTableLayout
                rows={filteredAppointments}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por motivo, usuario, estado, inicio'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                actions={
                    <Button
                        variant='contained'
                        onClick={() => setCreateAppointment(true)}
                        startIcon={<PersonAddAltIcon />}
                        loadingPosition='start'
                        sx={{ mr: 2 }}
                    >
                        Añadir cita
                    </Button>
                }
            />
        </>
    );
}
