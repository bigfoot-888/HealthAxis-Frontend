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
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { Link } from 'react-router';

import { useSearchFilter } from '@/hooks/useSearchFilter';
import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';

import AlertDialog from '@/components/dialogs/AlertDialog';
import { NestedTableLayout } from '@/components/tables';

import { useAppointments } from '@appointments/hooks/useAppointments';
import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';
import AppointmentChip from '@appointments/components/ui/AppointmentChip';
import { handleApiError } from '@/utils/handle-errors';
import CreateUserAppointmentForm from '../forms/CreateUserAppointmentForm';

function isCompleted(row) {
    return row.status === 'COMPLETED';
}

function isCheckedIn(row) {
    return row.status === 'CHECKED_IN';
}

function isScheduled(row) {
    return row.status === 'SCHEDULED';
}

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
                showInMenu
                icon={<VisibilityIcon />}
                label='Ver cita en detalle'
                component={Link}
                to={`/appointments/${row.uuid}`}
            />

            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                label='Editar cita'
                component={Link}
                to={`/appointments/edit/${row.uuid}`}
            />

            {!isCompleted(row) && (
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

export default function UserAppointmentsTable({ user, appointments, setError, refetch }) {
    const [searchText, setSearchText] = useState('');

    const filteredAppointments = useSearchFilter(appointments, searchText, ['id', 'reason', 'patient.fullName']);

    const [appointmentToComplete, setAppointmentToComplete] = useState(null);
    const [appointmentToCheckIn, setAppointmentToCheckIn] = useState(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const [createAppointment, setCreateAppointment] = useState(false);

    const handleCompleteAppointment = async (row) => {
        try {
            if (row) {
                await updateAppointmentStatus(row.uuid, 'COMPLETED');
                refetch();
            }
            setAppointmentToComplete(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCheckInAppointment = async (row) => {
        try {
            if (row) {
                await updateAppointmentStatus(row.uuid, 'CHECKED_IN');
                refetch();
            }
            setAppointmentToCheckIn(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const columns = useMemo(() => {
        return [
            {
                field: 'reason',
                headerName: 'Motivo',
                flex: 3,
            },
            {
                field: 'startTime',
                headerName: 'Fecha y hora de inicio',
                type: 'date',
                flex: 3,
                valueFormatter: (value) => formatDateTimeUTC(value),
            },
            {
                field: 'patient',
                headerName: 'Paciente',
                flex: 3,
                valueGetter: (value, row) => row.patient?.fullName || 'N/A',
            },
            {
                field: 'location',
                headerName: 'Lugar',
                flex: 2,
            },
            {
                field: 'status',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => <AppointmentChip value={params.value} />,
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
            {createAppointment && (
                <CreateUserAppointmentForm
                    open={createAppointment}
                    handleClose={() => setCreateAppointment(false)}
                    user={user}
                    refetch={refetch}
                />
            )}
            {appointmentToComplete && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToComplete(null)}
                    handleConfirm={() => handleCompleteAppointment(appointmentToComplete)}
                    title={`Completar cita: ${appointmentToComplete.patient.fullName}`}
                    content='Esta acción es irreversible.'
                />
            )}

            {appointmentToCheckIn && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToCheckIn(null)}
                    handleConfirm={() => handleCheckInAppointment(appointmentToCheckIn)}
                    title={`Check-in de cita: ${appointmentToCheckIn.patient.fullName}`}
                    content='Se marcará al paciente como presente.'
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
                searchPlaceholder='Busca por ID, motivo o paciente'
                onSearchChange={(e) => setSearchText(e.target.value)}
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
            />
        </>
    );
}
