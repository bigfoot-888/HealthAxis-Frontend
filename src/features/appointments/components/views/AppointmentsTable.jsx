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
import { Link, useNavigate } from 'react-router';

import { useSearchFilter } from '@/hooks/useSearchFilter';
import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';

import AlertDialog from '@/components/dialogs/AlertDialog';
import BasicTableLayout from '@/components/tables/BasicTableLayout';

import { useAppointments } from '@appointments/hooks/useAppointments';
import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';
import AppointmentChip from '@appointments/components/ui/AppointmentChip';
import { handleApiError } from '@/utils/handle-errors';
import AddClinicalDataStepperForm from '@appointments/components/forms/AddClinicalDataStepperForm';

function isCompleted(row) {
    return row.status === 'COMPLETED';
}

function isCheckedIn(row) {
    return row.status === 'CHECKED_IN';
}

function isScheduled(row) {
    return row.status === 'SCHEDULED';
}

function isCancelled(row) {
    return row.status === 'NO_SHOW' || row.status !== 'CANCELLED';
}

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
            {/* {!isCompleted(row) && isCheckedIn(row) && (
                <GridActionsCellItem
                    icon={
                        <Tooltip title='Registrar diagnóstico y tratamiento'>
                            <MedicalInformationIcon color='success' />
                        </Tooltip>
                    }
                    label='Registrar resultado clínico'
                    onClick={() => onAddClinicalData(row)}
                />
            )} */}
            <GridActionsCellItem
                showInMenu
                icon={<VisibilityIcon />}
                label='Ver cita en detalle'
                onClick={() => onCheckIn(row)}
            ></GridActionsCellItem>
            <GridActionsCellItem
                showInMenu
                icon={<EditIcon />}
                label='Editar cita'
                component={Link}
                to={`/appointments/edit/${row.uuid}`}
                state={{ from: `/appointments` }}
            />
            {isCancelled(row) && (
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

export default function AppointmentsTable({ appointments, setError }) {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const filteredAppointments = useSearchFilter(appointments, searchText, [
        'id',
        'reason',
        'user.fullName',
        'patient.fullName',
    ]);

    const { refetch } = useAppointments();
    const [appointmentToComplete, setAppointmentToComplete] = useState(null);
    const [appointmentToCheckIn, setAppointmentToCheckIn] = useState(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [appointmentToAddClinicalData, setAppointmentToAddClinicalData] = useState(null);

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

    // https://stackoverflow.com/questions/79546439/why-are-params-undefined-in-valuegetter-but-not-in-rendercell-when-using-mui-dat

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
                valueFormatter: (value) => {
                    return formatDateTimeUTC(value);
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
                flex: 2,
            },
            {
                field: 'status',
                headerName: 'Estado',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <AppointmentChip value={value} />;
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de Creación',
                flex: 2,
                hide: true,
                valueFormatter: (value) => {
                    return formatCreatedAt(value);
                },
            },
            {
                field: 'priority',
                headerName: 'Priority',
                hide: true,
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
                        onAddClinicalData={setAppointmentToAddClinicalData}
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

            {appointmentToAddClinicalData && (
                <AddClinicalDataStepperForm
                    appointment={appointmentToAddClinicalData}
                    open={!!appointmentToAddClinicalData}
                    handleClose={() => setAppointmentToAddClinicalData(null)}
                />
            )}

            <BasicTableLayout
                rows={computedAppointments}
                columns={columns}
                searchValue={searchText}
                searchPlaceholder={'Busca por ID, motivo, paciente, profesional'}
                onSearchChange={(e) => setSearchText(e.target.value)}
                sorting={{
                    sortModel: [{ field: 'priority', sort: 'asc' }],
                }}
                tableSpecificVisibility={{ priority: false }}
                onRowClick={(params) => {
                    navigate(`/appointments/${params.row.uuid}`);
                }}
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
