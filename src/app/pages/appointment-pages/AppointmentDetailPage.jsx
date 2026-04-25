import AppointmentInfoCard from '@appointments/components/ui/AppointmentInfoCard';
import UserSummaryCard from '@users/components/ui/UserSummaryCard';
import PatientSummaryCard from '@patients/components/ui/PatientSummaryCard';
import AppointmentDiagnosesTable from '@diagnoses/components/views/AppointmentDiagnosesTable';
import AppointmentTreatmentsTable from '@treatments/components/views/AppointmentTreatmentsTable';

import { useAppointment } from '@appointments/hooks/useAppointment';
import { useDiagnosesByAppointment } from '@diagnoses/hooks/useDiagnosesByAppointment';
import { useTreatmentsByAppointment } from '@treatments/hooks/useTreatmentsByAppointment';

import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import { useState } from 'react';
import { ContentLayout } from '@/components/layout';
import { AppBreadcrumbs } from '@/components/navigation';

import { Grid, Stack } from '@mui/material';

import AlertDialog from '@/components/dialogs/AlertDialog';
import CancelAppointmentForm from '@appointments/components/forms/CancelAppointmentForm';

import { handleApiError } from '@/utils/handle-errors';

export default function AppointmentDetailPage() {
    const { uuid } = useParams();

    const { data: appointment, isLoading, error: fetchError, refetch: refetchAppointment } = useAppointment(uuid);

    const appointmentUuid = appointment?.uuid;

    const { data: diagnoses = [], refetch: refetchDiagnoses } = useDiagnosesByAppointment(appointmentUuid);

    const { data: treatments = [], refetch: refetchTreatments } = useTreatmentsByAppointment(appointmentUuid);

    const [error, setError] = useState(null);

    const [appointmentToComplete, setAppointmentToComplete] = useState(null);
    const [appointmentToCheckIn, setAppointmentToCheckIn] = useState(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const handleCompleteAppointment = async (row) => {
        try {
            if (row) {
                await updateAppointmentStatus(row.uuid, 'COMPLETED');
                refetchAppointment();
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
                refetchAppointment();
            }
            setAppointmentToCheckIn(null);
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    if (fetchError) return <p>Failed to load appointment</p>;
    if (isLoading || !appointment) return <CustomCircularProgress />;

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            <AppBreadcrumbs items={[{ label: 'Citas', to: '/appointments' }, { label: `${appointment.reason}` }]} />

            {appointmentToComplete && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToComplete(null)}
                    handleConfirm={() => handleCompleteAppointment(appointmentToComplete)}
                    title={`Completar cita`}
                    content='Esta acción es irreversible. La cita se marcará como completada.'
                />
            )}

            {appointmentToCheckIn && (
                <AlertDialog
                    open
                    handleClose={() => setAppointmentToCheckIn(null)}
                    handleConfirm={() => handleCheckInAppointment(appointmentToCheckIn)}
                    title={`Check-in: ${appointmentToCheckIn.patient.fullName}`}
                    content='Se marcará al paciente como presente.'
                />
            )}

            {appointmentToCancel && (
                <CancelAppointmentForm
                    appointment={appointmentToCancel}
                    handleClose={() => setAppointmentToCancel(null)}
                    refetch={refetchAppointment}
                />
            )}

            {/* Layout */}
            <Grid container spacing={2}>
                {/* Top: Appointment Info */}
                <Grid size={12}>
                    <AppointmentInfoCard
                        appointment={appointment}
                        onCheckIn={setAppointmentToCheckIn}
                        onComplete={setAppointmentToComplete}
                        onCancel={setAppointmentToCancel}
                    />
                </Grid>

                {/* Middle: Summary Cards */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <PatientSummaryCard patient={appointment.patient} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <UserSummaryCard user={appointment.user} />
                </Grid>

                {/* Bottom: Tables */}
                <Grid size={12}>
                    <Stack spacing={2}>
                        <AppointmentDiagnosesTable
                            diagnoses={diagnoses}
                            appointment={appointment}
                            refetch={refetchDiagnoses}
                        />

                        <AppointmentTreatmentsTable treatments={treatments} refetch={refetchTreatments} />
                    </Stack>
                </Grid>
            </Grid>
        </ContentLayout>
    );
}
