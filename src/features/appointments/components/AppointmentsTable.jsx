import { GridActionsCellItem, GridActionsCell } from '@mui/x-data-grid';
import { useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAppointments } from '../hooks/useAppointments';
import { updateAppointmentState } from '../api/appointment-api';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AlertDialog from '../../../components/AlertDialog';
import FormDialog from '../../../components/FormDialog';
import BasicTableLayout from '../../../components/tables/BasicTableLayout';
import { Link } from 'react-router';
import { Chip, Tooltip } from '@mui/material';
import CancelAppointmentForm from './CancelAppointmentForm';
import ContentLayout from '../../../components/layout/ContentLayout';
function ActionsCell({ row, onCancel, onComplete, onCheckIn, onEdit }) {
    return (
        <GridActionsCell>
            <GridActionsCellItem
                icon={
                    <Tooltip title='Completar cita'>
                        <TaskAltIcon color='primary' />
                    </Tooltip>
                }
                label='Completar cita'
                onClick={() => onComplete(row)}
            />
            <GridActionsCellItem
                icon={
                    <Tooltip title='Validar check-in'>
                        <HowToRegIcon color='secondary' />
                    </Tooltip>
                }
                label='Validar check-in'
                onClick={() => onCheckIn(row)}
            />
            <GridActionsCellItem
                showInMenu
                icon={<VisibilityIcon />}
                label='Ver cita en detalle'
                onClick={() => onEdit(row)}
            ></GridActionsCellItem>
            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                label='Editar cita'
                component={Link}
                to={`/appointments/edit/${row.uuid}`}
            />
            <GridActionsCellItem
                showInMenu
                icon={<HighlightOffIcon />}
                label='Cancelar cita'
                onClick={() => onCancel(row)}
            ></GridActionsCellItem>
            {row.state === 'INACTIVE' && (
                <GridActionsCellItem
                    showInMenu
                    icon={<RestoreIcon />}
                    label='Restore'
                    onClick={() => onReactivate(row)}
                />
            )}
        </GridActionsCell>
    );
}

export default function AppointmentsTable({ appointments }) {
    const [searchText, setSearchText] = useState(''); // Searchbar text
    const [error, setError] = useState(null); // Non-form errors
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);

    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(null);

    // Utility to safely get nested values from an object using a string path
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };

    // Inside your useEffect
    useEffect(() => {
        const lowerSearch = searchText.toLowerCase();

        setFilteredAppointments(
            appointments.filter((appointment) =>
                ['id', 'reason', 'user.fullName', 'patient.fullName'].some((fieldPath) => {
                    const value = getNestedValue(appointment, fieldPath)?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            ),
        );
    }, [searchText, appointments]);

    const { refetch } = useAppointments();
    const [completeAppointmentRow, setCompleteAppointmentRow] = useState(null);
    const [checkInAppointmentRow, setCheckInAppointmentRow] = useState(null);
    const [cancelAppointmentRow, setCancelAppointmentRow] = useState(null);

    const handleCompleteAppointment = async (row) => {
        if (row) {
            await updateAppointmentState(row.uuid, 'COMPLETED');
            refetch();
        }
        setCompleteAppointmentRow(null);
    };

    const handleCheckInAppointment = async (row) => {
        if (row) {
            await updateAppointmentState(row.uuid, 'CHECKED_IN');
            refetch();
        }
        setCheckInAppointmentRow(null);
    };

    const handleCancelAppointment = async (row) => {
        if (row) {
        }
    };

    const stateColors = {
        SCHEDULED: 'info',
        COMPLETED: 'success',
        CANCELLED: 'error',
        NO_SHOW: 'warning',
        CHECKED_IN: 'primary',
    };

    const valueLabels = {
        SCHEDULED: 'Programada',
        COMPLETED: 'Completada',
        CANCELLED: 'Cancelada',
        NO_SHOW: 'No Asistió',
        CHECKED_IN: 'Registrada',
    };
    // https://stackoverflow.com/questions/79546439/why-are-params-undefined-in-valuegetter-but-not-in-rendercell-when-using-mui-dat

    const columns = useMemo(() => {
        return [
            {
                field: 'reason',
                headerName: 'Motivo',
                flex: 3,
            },
            {
                field: 'start_time',
                headerName: 'Fecha y hora de inicio',
                type: 'date',
                flex: 3,
                valueFormatter: (value) => {
                    const date = new Date(value);
                    return date.toLocaleString('es-ES', {
                        timeZone: 'UTC',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                },
            },
            {
                field: 'patient',
                headerName: 'Paciente',
                flex: 2,
                valueGetter: (value, row) => row.patient?.fullName || 'N/A',
            },
            {
                field: 'user',
                headerName: 'Profesional',
                flex: 2,
                valueGetter: (value, row) => row.user?.fullName || 'N/A',
            },
            {
                field: 'location',
                headerName: 'Lugar',
                flex: 1,
            },
            {
                field: 'state',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return (
                        <Chip
                            label={valueLabels[value] || value}
                            color={stateColors[value] || 'default'}
                            size='small'
                        />
                    );
                },
            },
            {
                field: 'end_time',
                headerName: 'Hora de fin',
                type: 'date',
                flex: 2,
                valueFormatter: (value) => (value ? new Date(value) : null),
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de Creación',
                flex: 2,
                hide: true,
                valueFormatter: (value) => {
                    const date = new Date(value);
                    const now = new Date();
                    const isToday =
                        date.getDate() === now.getDate() &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();

                    return isToday
                        ? date.toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : date.toLocaleDateString('es-ES');
                },
            },
            {
                field: 'actions',
                type: 'actions',
                flex: 3,
                renderCell: (params) => (
                    <ActionsCell
                        {...params}
                        onCancel={setCancelAppointmentRow}
                        onComplete={setCompleteAppointmentRow}
                        onCheckIn={setCheckInAppointmentRow}
                        onEdit={setOpenEditForm}
                    />
                ),
            },
        ];
    }, []);

    return (
        <>
            {completeAppointmentRow && (
                <AlertDialog
                    open={true}
                    handleClose={() => setCompleteAppointmentRow(null)}
                    handleConfirm={() => handleCompleteAppointment(completeAppointmentRow)}
                    title={`Completar cita: ${completeAppointmentRow.patient.fullName} - Dr. / Dra. ${completeAppointmentRow.user.fullName}`}
                    content='Esta acción es reversible. Al finalizar, la cita será finalizada.'
                />
            )}
            {checkInAppointmentRow && (
                <AlertDialog
                    open={!!checkInAppointmentRow}
                    handleClose={() => setCheckInAppointmentRow(null)}
                    handleConfirm={() => handleCheckInAppointment(checkInAppointmentRow)}
                    title={`Check-in de cita: ${checkInAppointmentRow.patient.fullName}  - Dr. / Dra. ${checkInAppointmentRow.user.fullName}`}
                    content='Esta acción es reversible. Al finalizar, se considerará al paciente presente para la cita.'
                />
            )}
            {cancelAppointmentRow && (
                <CancelAppointmentForm
                    appointment={cancelAppointmentRow}
                    handleClose={() => setCancelAppointmentRow(null)}
                />
            )}
                <BasicTableLayout
                    rows={filteredAppointments}
                    columns={columns}
                    searchValue={searchText}
                    searchPlaceholder={'Busca por ID, motivo, paciente, profesional'}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    actions={
                        <Button
                            variant='contained'
                            component={Link}
                            to='/appointments/new'
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
