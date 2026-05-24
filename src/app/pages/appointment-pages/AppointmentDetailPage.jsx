import AppointmentInfoCard from '@appointments/components/ui/AppointmentInfoCard';
import UserSummaryCard from '@users/components/ui/UserSummaryCard';
import PatientSummaryCard from '@patients/components/ui/PatientSummaryCard';
import AppointmentDiagnosesTable from '@diagnoses/components/views/AppointmentDiagnosesTable';
import AppointmentTreatmentsTable from '@treatments/components/views/AppointmentTreatmentsTable';

import { useAppointment } from '@appointments/hooks/useAppointment';
import { useDiagnosesByAppointment } from '@/features/clinical-records/diagnoses/hooks/useDiagnosesByAppointment';
import { useTreatmentsByAppointment } from '@treatments/hooks/useTreatmentsByAppointment';

import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { useState } from 'react';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';

import { Grid, Box } from '@mui/material';

import AlertDialog from '@/components/dialogs/AlertDialog';
import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';

import { handleApiError } from '@/utils/handle-errors';

import { useSnackbar } from '@/app/SnackBarContext';

import { DetailSectionHeader, RelatedEntityContainer } from '@/components/ui';
import { DetailLayout } from '@/components/entity-detail';
import { invalidateEditAppointmentQueries } from '@/features/appointments/utils/appointment-query.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Error from '@/components/feedback/Error';

export default function AppointmentDetailPage() {
    const { uuid } = useParams();
    const { data: appointment, isLoading, error: fetchError } = useAppointment(uuid);

    const appointmentUuid = appointment?.uuid;
    const { data: diagnoses = [] } = useDiagnosesByAppointment(appointmentUuid);
    const { data: treatments = [] } = useTreatmentsByAppointment(appointmentUuid);

    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const [appointmentToComplete, setAppointmentToComplete] = useState(null);
    const [appointmentToCheckIn, setAppointmentToCheckIn] = useState(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const queryClient = useQueryClient(); 

    const handleCompleteAppointment = async (row) => {
        try {
            await updateAppointmentStatus(row.uuid, 'COMPLETED');
            invalidateEditAppointmentQueries(queryClient, appointment)
            setAppointmentToComplete(null);
            showSnackbar({ message: 'Cita completada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCheckInAppointment = async (row) => {
        try {
            await updateAppointmentStatus(row.uuid, 'CHECKED_IN');
            invalidateEditAppointmentQueries(queryClient, appointment)
            setAppointmentToCheckIn(null);
            showSnackbar({ message: 'Cita registrada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    if (fetchError) return <Error msg="Error al cargar las citas."/>
    if (isLoading || !appointment) return <CustomCircularProgress />;

    return (
        <ContentLayout>
            {appointmentToComplete && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToComplete(null)}
                    handleConfirm={() => handleCompleteAppointment(appointmentToComplete)}
                    title={`Completar cita`}
                    content='Esta acción es irreversible. La cita se marcará como completada.'
                    error={error}
                    onErrorClose={()=>setError(null)}
                />
            )}

            {appointmentToCheckIn && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToCheckIn(null)}
                    handleConfirm={() => handleCheckInAppointment(appointmentToCheckIn)}
                    title={`Registrar cita`}
                    content='Se marcará al paciente como presente para realizar la cita.'
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
            <DetailLayout>
                <AppBreadcrumbs items={[{ label: 'Citas', to: '/appointments' }, { label: `${appointment.reason}` }]} />
                <Box>
                    <DetailSectionHeader label='Información de la Cita' marginTop={false} />
                    <AppointmentInfoCard
                        appointment={appointment}
                        onCheckIn={setAppointmentToCheckIn}
                        onComplete={setAppointmentToComplete}
                        onCancel={setAppointmentToCancel}
                    />
                </Box>

                {/* Patient and user */}
                <Box>
                    <DetailSectionHeader label='Contexto de la Visita' />
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <RelatedEntityContainer label='Paciente'>
                                <PatientSummaryCard patient={appointment.patient} />
                            </RelatedEntityContainer>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <RelatedEntityContainer label='Profesional asignado'>
                                <UserSummaryCard user={appointment.user} />
                            </RelatedEntityContainer>
                        </Grid>
                    </Grid>
                </Box>

                {/* Diagnoses */}
                <Box>
                    <DetailSectionHeader label='Diagnósticos Realizados' />
                    <Box sx={{ px: 1 }}>
                        <AppointmentDiagnosesTable
                            diagnoses={diagnoses}
                            appointment={appointment}
                        />
                    </Box>
                </Box>

                {/* Treatments */}
                <Box>
                    <DetailSectionHeader label='Tratamientos Prescritos' />
                    <Box sx={{ px: 1 }}>
                        <AppointmentTreatmentsTable treatments={treatments} appointment={appointment}/>
                    </Box>
                </Box>
            </DetailLayout>
        </ContentLayout>
    );
}
